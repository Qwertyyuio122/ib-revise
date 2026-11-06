import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DUMMY_SAMPLE_QUESTIONS } from '@/data/dummy-data';
import { SampleQuestion } from '@/types/database';

const SUBJECT_CODE_TO_DB_ID: Record<string, string> = {
  BIO_HL: 'biology_hl',
  HIST_HL: 'history_hl',
  ENG_LIT_HL: 'english_lit_hl',
  MATH_AA_SL: 'math_aa_sl',
  FR_B_SL: 'french_b_sl',
  CHEM_SL: 'chemistry_sl',
};

const DB_ID_TO_SUBJECT_CODE: Record<string, string> = {
  biology_hl: 'BIO_HL',
  history_hl: 'HIST_HL',
  english_lit_hl: 'ENG_LIT_HL',
  math_aa_sl: 'MATH_AA_SL',
  french_b_sl: 'FR_B_SL',
  chemistry_sl: 'CHEM_SL',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subjectParam = searchParams.get('subject');
  const topicIdParam = searchParams.get('topicId');
  const paperParam = searchParams.get('paper');
  const difficultyParam = searchParams.get('difficulty');
  const searchQuery = searchParams.get('q')?.trim();
  const cursor = searchParams.get('cursor');
  const limit = Math.min(
    parseInt(searchParams.get('limit') || '20', 10),
    50
  );

  try {
    const supabase = await createClient();

    let query = supabase
      .from('questions')
      .select(
        `
        id,
        subject_id,
        topic_id,
        paper_number,
        session,
        prompt_text,
        mark_value,
        command_term,
        official_markscheme_text,
        question_type,
        mcq_options,
        difficulty,
        created_at,
        topics (
          title,
          topic_number
        )
      `
      )
      .order('id', { ascending: true })
      .limit(limit);

    if (subjectParam) {
      const dbSubjectId =
        SUBJECT_CODE_TO_DB_ID[subjectParam] || subjectParam.toLowerCase();
      query = query.eq('subject_id', dbSubjectId);
    }

    if (topicIdParam) {
      query = query.eq('topic_id', topicIdParam);
    }

    if (paperParam && ['P1', 'P2', 'P3'].includes(paperParam)) {
      const paperNum = parseInt(paperParam.replace('P', ''), 10);
      query = query.eq('paper_number', paperNum);
    }

    if (difficultyParam) {
      const diff = parseInt(difficultyParam, 10);
      if (diff >= 1 && diff <= 7) {
        query = query.eq('difficulty', diff);
      }
    }

    if (searchQuery) {
      query = query.textSearch('search_tokens', searchQuery, {
        type: 'websearch',
        config: 'english',
      });
    }

    if (cursor) {
      query = query.gt('id', cursor);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      const fallback = DUMMY_SAMPLE_QUESTIONS.filter((q) => {
        if (subjectParam && q.subjectCode !== subjectParam) return false;
        if (paperParam && q.paper !== paperParam) return false;
        if (
          difficultyParam &&
          q.difficulty !== parseInt(difficultyParam, 10)
        ) {
          return false;
        }
        if (searchQuery) {
          const lower = searchQuery.toLowerCase();
          return (
            q.promptMarkdown.toLowerCase().includes(lower) ||
            q.topicLabel.toLowerCase().includes(lower) ||
            q.session.toLowerCase().includes(lower)
          );
        }
        return true;
      }).slice(0, limit);

      return NextResponse.json({
        questions: fallback,
        nextCursor: null,
        source: 'sample_fallback',
      });
    }

    const mappedQuestions: SampleQuestion[] = data.map((row) => {
      const topicObj = Array.isArray(row.topics)
        ? row.topics[0]
        : (row.topics as { title?: string; topic_number?: number } | null);

      const paperNum = (row.paper_number as number) || 1;
      const paperCode: 'P1' | 'P2' | 'P3' =
        paperNum === 2 ? 'P2' : paperNum === 3 ? 'P3' : 'P1';

      const diffNum = Math.min(
        Math.max((row.difficulty as number) || 4, 1),
        7
      ) as 1 | 2 | 3 | 4 | 5 | 6 | 7;

      return {
        id: row.id as string,
        subjectCode:
          DB_ID_TO_SUBJECT_CODE[row.subject_id as string] || 'BIO_HL',
        topicId: row.topic_id as string,
        topicLabel: topicObj?.title
          ? `Topic ${topicObj.topic_number ?? 1} • ${topicObj.title}`
          : 'Core Syllabus Topic',
        paper: paperCode,
        session: (row.session as string) || 'M24-TZ1',
        questionType:
          row.question_type === 'MCQ'
            ? 'MCQ'
            : row.question_type === 'ESSAY'
            ? 'EXTENDED'
            : 'SHORT',
        promptMarkdown: row.prompt_text as string,
        markSchemeMarkdown: row.official_markscheme_text as string,
        maxMarks: (row.mark_value as number) || 4,
        difficulty: diffNum,
      };
    });

    const nextCursor =
      mappedQuestions.length === limit
        ? mappedQuestions[mappedQuestions.length - 1].id
        : null;

    return NextResponse.json({
      questions: mappedQuestions,
      nextCursor,
      source: 'supabase_fts',
    });
  } catch {
    return NextResponse.json({
      questions: DUMMY_SAMPLE_QUESTIONS.slice(0, limit),
      nextCursor: null,
      source: 'sample_fallback',
    });
  }
}
