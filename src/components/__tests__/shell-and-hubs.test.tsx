import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import { BiologyVisualizationsTool } from '@/components/tools/BiologyVisualizationsTool';
import { MathFormulaBookletTool } from '@/components/tools/MathFormulaBookletTool';
import { FrenchLanguageStudioTool } from '@/components/tools/FrenchLanguageStudioTool';
import { EnglishLiteratureStudioTool } from '@/components/tools/EnglishLiteratureStudioTool';
import { ChemistryCalcCheckerTool } from '@/components/tools/ChemistryCalcCheckerTool';
import { TopUtilityBar } from '@/components/shell/TopUtilityBar';
import { AppShell } from '@/components/shell/AppShell';
import { LeftSidebar } from '@/components/shell/LeftSidebar';
import { CommandSearchModal } from '@/components/shell/CommandSearchModal';
import { StudyTimerPopover } from '@/components/shell/StudyTimerPopover';
import { SubjectHubClient } from '@/components/subjects/SubjectHubClient';
import { biologyHlPack } from '@/content/subjects/biology-hl';
import OriginalityCheckPage from '@/app/(app)/tools/originality-check/page';
import FlashcardsPage from '@/app/(app)/flashcards/page';
import StudyPlannerPage from '@/app/(app)/planner/page';

const pushMock = vi.fn();
const refreshMock = vi.fn();
const routerMock = {
  push: pushMock,
  replace: pushMock,
  refresh: refreshMock,
};
let mockPathname = '/';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('SproutMascot & KaTeXText Visual Components', () => {
  it('renders all 6 Sprout mascot poses cleanly', () => {
    const poses = ['emblem', 'avatar', 'guide', 'snoozing', 'baby', 'notepad'] as const;
    for (const pose of poses) {
      const { unmount } = render(<SproutMascot pose={pose} />);
      expect(document.querySelector('svg')).not.toBeNull();
      unmount();
    }
  });

  it('renders inline and display KaTeX math expressions', () => {
    render(
      <KaTeXText text="Enthalpy change $\Delta H^\ominus = -1367\text{ kJ mol}^{-1}$ and $$\int_0^\pi \sin(x)\,dx = 2$$" />
    );
    expect(screen.getByText(/Enthalpy change/i)).toBeInTheDocument();
    expect(document.querySelector('.katex')).not.toBeNull();
  });

  it('protects math blocks from markdown formatting and renders headings and lists', () => {
    render(
      <KaTeXText
        text={'## Rate Law\n- Multiply $a * b * c$ inside math\n- Bold **keyword**'}
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Rate Law' })).toBeInTheDocument();
    expect(document.querySelectorAll('li').length).toBe(2);
    expect(document.querySelector('.katex')).not.toBeNull();
    // Ensure * inside KaTeX annotation was NOT turned into <em> tags
    const annotation = document.querySelector('annotation');
    expect(annotation?.textContent).toBe('a * b * c');
    expect(document.querySelector('em')).toBeNull();
  });

  it('renders mhchem formulas, escaped dollars, and neutralizes unsafe XSS input in KaTeXText', () => {
    const { container } = render(
      <KaTeXText
        text={
          'Reaction: \\ce{2H2 + O2 -> 2H2O}, ion $\\ce{SO4^{2-}}$, budget \\$13bn to \\$50bn, <script>alert(1)</script> $\\href{javascript:alert(1)}{click}$'
        }
      />
    );
    expect(container.querySelector('.katex')).not.toBeNull();
    expect(container.querySelector('.katex-error')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container.innerHTML).not.toContain('color:#cc0000;">\\ce');
    expect(container.textContent).toContain('$13bn to $50bn');
    expect(container.textContent).toContain('<script>alert(1)</script>');
  });

  it('renders BiologyVisualizationsTool hotspots with button role and aria-label', () => {
    render(<BiologyVisualizationsTool />);
    const buttons = screen.getAllByRole('button');
    const hotspotButton = buttons.find((b) =>
      b.getAttribute('aria-label')?.includes('Hotspot 1')
    );
    expect(hotspotButton).toBeDefined();
    expect(hotspotButton).toHaveAttribute('tabindex', '0');
  });

  it('renders MathFormulaBookletTool search input with aria-label', () => {
    render(<MathFormulaBookletTool />);
    const searchInput = screen.getByLabelText(/search formulas/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders FrenchLanguageStudioTool checklist buttons with aria-pressed', () => {
    render(<FrenchLanguageStudioTool />);
    const checklistButtons = screen.getAllByRole('button');
    const conventionBtn = checklistButtons.find((b) =>
      b.hasAttribute('aria-pressed')
    );
    expect(conventionBtn).toBeDefined();
    expect(conventionBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders ChemistryCalcCheckerTool with KaTeX heading', () => {
    render(<ChemistryCalcCheckerTool />);
    expect(screen.getByText(/Calculation Step Checker/i)).toBeInTheDocument();
  });

  it('renders EnglishLiteratureStudioTool with aria-label on assessment selects', () => {
    render(<EnglishLiteratureStudioTool />);
    const prlTabBtn = screen.getByRole('button', { name: /13-Work PRL/i });
    fireEvent.click(prlTabBtn);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
    expect(selects[0]).toHaveAttribute('aria-label');
  });
});

describe('Shell TopUtilityBar & AppShell', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    pushMock.mockReset();
    mockPathname = '/';
    mockSearchParams = new URLSearchParams();
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ notifications: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not render the Gemini Ready (BYOK) pill button in TopUtilityBar', async () => {
    render(
      <TopUtilityBar
        userName="Harris"
        streakCount={0}
        onOpenSearch={vi.fn()}
        onToggleMobileMenu={vi.fn()}
      />
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/notifications', expect.any(Object)));
    expect(screen.queryByText(/Gemini Key Ready/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gemini Ready \(BYOK\)/i)).not.toBeInTheDocument();
    expect(screen.getByText('Simple Revision')).toBeInTheDocument();
  });

  it('renders empty state when notifications list is empty', async () => {
    render(
      <TopUtilityBar
        userName="Harris"
        streakCount={0}
        onOpenSearch={vi.fn()}
        onToggleMobileMenu={vi.fn()}
      />
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }));
    expect(screen.getByText('No notifications yet.')).toBeInTheDocument();
  });

  it('redirects to /login when notifications API returns 401', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    });
    render(
      <TopUtilityBar
        userName="Harris"
        streakCount={0}
        onOpenSearch={vi.fn()}
        onToggleMobileMenu={vi.fn()}
      />
    );
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/login'));
  });

  it('renders AppShell with optional initialHasGeminiKey without GeminiKeyModal', async () => {
    render(
      <AppShell
        initialUserName="Harris"
        initialStreakCount={0}
        initialHasGeminiKey={false}
      >
        <div>Study Workspace Content</div>
      </AppShell>
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/notifications', expect.any(Object)));
    expect(screen.getByText('Study Workspace Content')).toBeInTheDocument();
    expect(screen.queryByText(/Gemini Key Ready/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gemini Ready \(BYOK\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Free Gemini API Key \(BYOK\)/i)).not.toBeInTheDocument();
  });

  it('LeftSidebar highlights Coursework Guides and Exemplars mutually exclusively and toggles My Subjects on subject routes', () => {
    mockPathname = '/coursework';
    mockSearchParams = new URLSearchParams();
    const { rerender } = render(<LeftSidebar mobileOpen={false} onCloseMobile={vi.fn()} />);

    const guidesLink = screen.getByRole('link', { name: 'Coursework Guides' });
    const exemplarsLink = screen.getByRole('link', { name: 'Exemplars' });
    expect(guidesLink.className).toContain('bg-[#E4E4E7]');
    expect(exemplarsLink.className).not.toContain('bg-[#E4E4E7]');

    mockSearchParams = new URLSearchParams('tab=exemplars');
    rerender(<LeftSidebar mobileOpen={false} onCloseMobile={vi.fn()} />);
    expect(exemplarsLink.className).toContain('bg-[#E4E4E7]');
    expect(guidesLink.className).not.toContain('bg-[#E4E4E7]');

    mockPathname = '/subjects/bio';
    mockSearchParams = new URLSearchParams();
    rerender(<LeftSidebar mobileOpen={false} onCloseMobile={vi.fn()} />);
    const toggleBtn = screen.getByRole('button', { name: 'Toggle 6 Subjects List' });
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Chemistry SL' })).not.toBeInTheDocument();
  });

  it('CommandSearchModal Retry button triggers a new search fetch', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ results: [] }),
      });

    render(<CommandSearchModal isOpen={true} onClose={vi.fn()} />);
    const retryBtn = await screen.findByRole('button', { name: /retry search/i });
    fireEvent.click(retryBtn);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('LeftSidebar expands subjects and closes mobile drawer on Escape', () => {
    const onCloseMobile = vi.fn();
    render(<LeftSidebar mobileOpen={true} onCloseMobile={onCloseMobile} />);

    const toggleBtn = screen.getAllByRole('button', { name: 'Toggle 6 Subjects List' })[0];
    fireEvent.click(toggleBtn);
    expect(screen.getAllByRole('link', { name: 'Chemistry SL' }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Theory of Knowledge/i)).not.toBeInTheDocument();

    expect(screen.getByRole('dialog', { name: 'Navigation Menu' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it('AppShell handles Cmd+K search modal opening and keyboard result navigation', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ notifications: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          results: [
            {
              id: 't1',
              type: 'topic',
              subjectSlug: 'bio',
              title: 'A1.1 Water',
              subtitle: 'Biology HL',
              href: '/subjects/bio?topic=bio-A1.1',
            },
            {
              id: 't2',
              type: 'topic',
              subjectSlug: 'chem',
              title: 'S1.4 Mole Concept',
              subtitle: 'Chemistry SL',
              href: '/subjects/chem?topic=chem-S1.4',
            },
          ],
        }),
      });

    render(
      <AppShell initialUserName="Harris" initialStreakCount={0}>
        <div>Workspace Body</div>
      </AppShell>
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/notifications', expect.any(Object)));

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    const searchInput = screen.getByLabelText(/search syllabus codes/i);
    await screen.findByText('S1.4 Mole Concept');
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(pushMock).toHaveBeenCalledWith('/subjects/chem?topic=chem-S1.4');
  });

  it('StudyTimerPopover switches presets and restarts cleanly after reaching 00:00', () => {
    vi.useFakeTimers();
    try {
      render(<StudyTimerPopover />);
      fireEvent.click(screen.getByRole('button', { name: 'Study Timer' }));
      expect(screen.getByRole('dialog', { name: 'Study Timer' })).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '45m Essay' }));
      expect(screen.getByText('45:00')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Start Timer' }));
      act(() => {
        vi.setSystemTime(Date.now() + 45 * 60 * 1000);
        vi.advanceTimersByTime(600);
      });
      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Start Timer' })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Start Timer' }));
      expect(screen.getAllByText('45:00')).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('SubjectHubClient renders error state with Retry and uses KaTeXText for guiding questions', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    });

    const topicsWithKaTeX = [
      {
        ...biologyHlPack.topics[0],
        guidingQuestions: ['How does water potential $\\Psi_w = \\Psi_s + \\Psi_p$ govern osmosis?'],
      },
      ...biologyHlPack.topics.slice(1),
    ];

    render(
      <SubjectHubClient
        subject={biologyHlPack.subject}
        topics={topicsWithKaTeX}
        initialTab="plan"
      />
    );

    const retryBtn = await screen.findByRole('button', { name: /retry loading plan/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /topics & progress/i }));
    expect(screen.getByText(topicsWithKaTeX[0].title)).toBeInTheDocument();
    expect(document.querySelector('.katex')).not.toBeNull();
  });

  it('OriginalityCheckPage starts as a blank slate and surfaces API errors', async () => {
    render(<OriginalityCheckPage />);
    const textarea = screen.getByLabelText(/coursework excerpt/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
    expect(screen.getByRole('button', { name: /load sample/i })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Analysis service unavailable' }),
    });
    fireEvent.change(textarea, { target: { value: 'Sample IB essay paragraph.' } });
    fireEvent.click(screen.getByRole('button', { name: /analyze originality/i }));
    expect(await screen.findByText(/Analysis service unavailable/i)).toBeInTheDocument();
  });

  it('FlashcardsPage flips once on Space and closes modal on Escape without closing on POST failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        decks: [
          {
            id: 'deck-chem-1',
            subjectSlug: 'chem',
            topicId: null,
            title: 'Chemistry SL Energetics',
            description: 'Enthalpy',
          },
        ],
        cards: [
          {
            id: 'card-1',
            deckId: 'deck-chem-1',
            frontMarkdown: 'State Hess’s Law',
            backMarkdown: 'Enthalpy change is path-independent.',
            tags: ['SL'],
            easeFactor: 2.5,
            intervalDays: 0,
            repetitions: 0,
            dueAt: Date.now(),
          },
        ],
      }),
    });

    render(<FlashcardsPage />);
    const flipCard = await screen.findByRole('button', {
      name: /flashcard front prompt/i,
    });
    flipCard.focus();
    fireEvent.keyDown(flipCard, { key: ' ', code: 'Space' });
    expect(screen.getByText(/Markscheme Answer \(Back\)/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Add Flashcard$/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Failed POST keeps modal open and shows error
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Flashcard creation failed' }),
    });
    fireEvent.change(screen.getByLabelText(/front prompt/i), {
      target: { value: 'Prompt' },
    });
    fireEvent.change(screen.getByLabelText(/back markscheme answer/i), {
      target: { value: 'Answer' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save flashcard/i }));
    expect(await screen.findByText(/Flashcard creation failed/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Escape closes open modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('PlannerPage distinguishes Today (empty without fallback), Week (7-day), and Month views', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const day3Date = new Date(Date.now() + 3 * 86400_000).toISOString().slice(0, 10);
    const day15Date = new Date(Date.now() + 15 * 86400_000).toISOString().slice(0, 10);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        tasks: [
          {
            id: 't-week',
            subjectSlug: 'bio',
            title: 'Week Block',
            scheduledDate: day3Date,
            startTime: '16:00',
            durationMinutes: 45,
            taskType: 'questions',
            completed: 0,
          },
          {
            id: 't-month',
            subjectSlug: 'math',
            title: 'Month Horizon Block',
            scheduledDate: day15Date,
            startTime: '16:00',
            durationMinutes: 45,
            taskType: 'questions',
            completed: 0,
          },
        ],
      }),
    });

    render(<StudyPlannerPage />);
    await screen.findByText('Week Block');
    expect(screen.queryByText('Month Horizon Block')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /focus \(today\)/i }));
    expect(screen.queryByText('Week Block')).not.toBeInTheDocument();
    expect(
      screen.getByText(/no study blocks scheduled for today/i)
    ).toBeInTheDocument();
    expect(today.length).toBe(10);

    fireEvent.click(screen.getByRole('tab', { name: /^month$/i }));
    expect(screen.getByText('Week Block')).toBeInTheDocument();
    expect(screen.getByText('Month Horizon Block')).toBeInTheDocument();
  });
});
