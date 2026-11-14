import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, ensureDbReady, schema } from '@/db';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody, validationErrorResponse } from '@/app/api/_lib/json';

const CreateTaskSchema = z.object({
  generateSchedule: z.boolean().optional(),
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).optional(),
  title: z.string().trim().max(300).optional(),
  scheduledDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'scheduledDate must use YYYY-MM-DD format.')
    .optional()
    .or(z.literal('')),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'startTime must use HH:MM format.')
    .optional()
    .or(z.literal('')),
  durationMinutes: z.number().int().min(10).max(240).optional(),
  taskType: z
    .enum(['questions', 'flashcards', 'mock_exam', 'essay_ia', 'blurting'])
    .optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string().trim().min(1).max(200),
  completed: z.boolean(),
});

const DeleteTaskSchema = z.object({
  id: z.string().trim().min(1).max(200),
});

function dateOffsetIso(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

function buildStarterSchedule(userId: string, filterSubject?: string) {
  const templates = [
    {
      dayOffset: 0,
      subjectSlug: 'bio',
      title: 'B2.1 Membranes & Water Potential ($\\Psi_w$) Paper 2 Section B Drill',
      startTime: '16:00',
      durationMinutes: 45,
      taskType: 'questions',
      completed: 0,
    },
    {
      dayOffset: 0,
      subjectSlug: 'chem',
      title: 'Reactivity 1.1–1.3 Enthalpy ($\\Delta H$) & Calorimetry Active Recall Blurt',
      startTime: '17:00',
      durationMinutes: 30,
      taskType: 'blurting',
      completed: 0,
    },
    {
      dayOffset: 0,
      subjectSlug: 'math',
      title: 'Topic 5 Calculus Kinematics ($\\int |v(t)|\\,dt$) Timed Practice',
      startTime: '18:15',
      durationMinutes: 45,
      taskType: 'questions',
      completed: 0,
    },
    {
      dayOffset: 1,
      subjectSlug: 'hist',
      title: 'Paper 1 Source Lab: Treaty of Versailles OPCVL Evaluation',
      startTime: '16:30',
      durationMinutes: 45,
      taskType: 'questions',
      completed: 0,
    },
    {
      dayOffset: 2,
      subjectSlug: 'eng',
      title: 'HL Essay Draft Check: Authorial Choices & Criterion B Rubric',
      startTime: '17:00',
      durationMinutes: 60,
      taskType: 'essay_ia',
      completed: 0,
    },
    {
      dayOffset: 3,
      subjectSlug: 'fr',
      title: 'French B SL Oral Individuel + Subjonctif SM-2 Flashcard Deck',
      startTime: '16:00',
      durationMinutes: 35,
      taskType: 'flashcards',
      completed: 0,
    },
    {
      dayOffset: 4,
      subjectSlug: 'bio',
      title: 'C1.2 Cellular Respiration & Chemiosmosis Full Timed Mock Paper',
      startTime: '15:30',
      durationMinutes: 60,
      taskType: 'mock_exam',
      completed: 0,
    },
    {
      dayOffset: 5,
      subjectSlug: 'chem',
      title: 'Structure 2.2 Covalent Bonding, Lewis Formulas & VSEPR Review',
      startTime: '17:00',
      durationMinutes: 40,
      taskType: 'flashcards',
      completed: 0,
    },
    {
      dayOffset: 6,
      subjectSlug: 'math',
      title: 'Topic 4 Binomial & Normal Distributions Paper 2 GDC Drill',
      startTime: '16:30',
      durationMinutes: 50,
      taskType: 'questions',
      completed: 0,
    },
  ];

  const filtered = filterSubject
    ? templates.filter((t) => t.subjectSlug === filterSubject)
    : templates;

  return filtered.map((t, index) => ({
    id: `${userId}-task-${t.subjectSlug}-${index}-${crypto.randomUUID().slice(0, 6)}`,
    userId,
    subjectSlug: t.subjectSlug,
    topicId: `${t.subjectSlug}-core`,
    title: t.title,
    scheduledDate: dateOffsetIso(t.dayOffset),
    startTime: t.startTime,
    durationMinutes: t.durationMinutes,
    taskType: t.taskType,
    completed: t.completed,
  }));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureDbReady();
    const tasks = await db
      .select()
      .from(schema.studyTasks)
      .where(eq(schema.studyTasks.userId, user.id))
      .all();

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load study tasks.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = CreateTaskSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid study task payload.', parsed.error);
    }

    await ensureDbReady();

    if (parsed.data.generateSchedule) {
      const generated = buildStarterSchedule(user.id, parsed.data.subjectSlug);
      if (generated.length > 0) {
        await db.insert(schema.studyTasks).values(generated).run();
      }
      const allTasks = await db
        .select()
        .from(schema.studyTasks)
        .where(eq(schema.studyTasks.userId, user.id))
        .all();
      return NextResponse.json({ tasks: allTasks });
    }

    if (!parsed.data.title?.trim()) {
      return NextResponse.json(
        { error: 'Task title is required.' },
        { status: 400 }
      );
    }

    const newTask = {
      id: `task-${crypto.randomUUID()}`,
      userId: user.id,
      subjectSlug: parsed.data.subjectSlug ?? 'bio',
      topicId: null,
      title: parsed.data.title.trim(),
      scheduledDate: parsed.data.scheduledDate || dateOffsetIso(0),
      startTime: parsed.data.startTime || '16:30',
      durationMinutes: parsed.data.durationMinutes ?? 45,
      taskType: parsed.data.taskType ?? 'questions',
      completed: 0,
    };

    await db.insert(schema.studyTasks).values(newTask).run();

    return NextResponse.json({ task: newTask });
  } catch {
    return NextResponse.json(
      { error: 'Unable to create study task.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = UpdateTaskSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid task update payload.', parsed.error);
    }

    await ensureDbReady();
    const existing = await db
      .select({ id: schema.studyTasks.id })
      .from(schema.studyTasks)
      .where(
        and(
          eq(schema.studyTasks.id, parsed.data.id),
          eq(schema.studyTasks.userId, user.id)
        )
      )
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Study task not found.' },
        { status: 404 }
      );
    }

    await db
      .update(schema.studyTasks)
      .set({ completed: parsed.data.completed ? 1 : 0 })
      .where(
        and(
          eq(schema.studyTasks.id, parsed.data.id),
          eq(schema.studyTasks.userId, user.id)
        )
      )
      .run();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update task status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = DeleteTaskSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid task delete payload.', parsed.error);
    }

    await ensureDbReady();
    await db
      .delete(schema.studyTasks)
      .where(
        and(
          eq(schema.studyTasks.id, parsed.data.id),
          eq(schema.studyTasks.userId, user.id)
        )
      )
      .run();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to delete task.' },
      { status: 500 }
    );
  }
}
