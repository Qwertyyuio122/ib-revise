import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { analyzeOriginalityHeuristic } from '@/lib/originality';
import { parseJsonBody } from '@/app/api/_lib/json';

const OriginalityRequestSchema = z.object({
  text: z.string().min(1, 'Text is required for originality analysis').max(50_000),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = OriginalityRequestSchema.safeParse(jsonBody.data);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const signal = analyzeOriginalityHeuristic(parsed.data.text);
    return NextResponse.json(signal);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to analyze originality signal',
      },
      { status: 500 }
    );
  }
}
