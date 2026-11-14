import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryQuestionsPage } from '@/lib/question-queries';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = req.nextUrl.searchParams;
    const rawPage = Number.parseInt(params.get('page') ?? '1', 10);
    const rawLimit = Number.parseInt(params.get('limit') ?? '25', 10);
    const hasDiagramParam = params.get('hasDiagram');

    const result = await queryQuestionsPage({
      subject: params.get('subject'),
      topicId: params.get('topicId'),
      paper: params.get('paper'),
      questionType: params.get('questionType'),
      difficulty: params.get('difficulty'),
      calculatorPolicy: params.get('calculatorPolicy'),
      hasDiagram: hasDiagramParam === '1' || hasDiagramParam === 'true',
      q: params.get('q'),
      mode: params.get('mode'),
      questionId: params.get('questionId'),
      page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
      limit: Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 25,
      shuffle: params.get('shuffle') === '1',
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        questions: [],
        topics: [],
        totalCount: 0,
        page: 1,
        limit: 25,
        totalPages: 1,
        error: 'Unable to load questions.',
      },
      { status: 500 }
    );
  }
}
