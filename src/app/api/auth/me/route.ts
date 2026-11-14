import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { normalizeGeminiModel } from '@/lib/gemini';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      hasGeminiKey: Boolean(
        user.geminiApiKey?.trim() || process.env.GEMINI_API_KEY?.trim()
      ),
      preferredGeminiModel: normalizeGeminiModel(user.preferredGeminiModel),
      streakCount: user.streakCount,
    },
  });
}
