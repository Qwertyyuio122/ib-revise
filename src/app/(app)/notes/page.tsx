'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useDeferredValue,
  useCallback,
  useRef,
  Suspense,
} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { KaTeXText } from '@/components/math/KaTeXText';
import {
  FileText,
  Pin,
  Plus,
  Save,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface NoteItem {
  id: string;
  subjectSlug: SubjectSlug;
  topicId: string | null;
  title: string;
  contentMarkdown: string;
  excerpt: string;
  isPinned: number;
  updatedAt: number;
}

const SUBJECT_FOLDERS: Array<{ slug: 'all' | SubjectSlug; label: string }> = [
  { slug: 'all', label: 'All Subjects' },
  { slug: 'bio', label: 'Biology HL' },
  { slug: 'chem', label: 'Chemistry SL' },
  { slug: 'hist', label: 'History HL' },
  { slug: 'eng', label: 'English Lit HL' },
  { slug: 'fr', label: 'French B SL' },
  { slug: 'math', label: 'Math AA SL' },
];

const SUBJECT_ONLY_OPTIONS: Array<{ slug: SubjectSlug; label: string }> = [
  { slug: 'bio', label: 'Biology HL' },
  { slug: 'chem', label: 'Chemistry SL' },
  { slug: 'hist', label: 'History HL' },
  { slug: 'eng', label: 'English Lit HL' },
  { slug: 'fr', label: 'French B SL' },
  { slug: 'math', label: 'Math AA SL' },
];

const VALID_SUBJECTS: SubjectSlug[] = ['bio', 'chem', 'hist', 'eng', 'fr', 'math'];

function parseSubjectSlug(raw: string | null): SubjectSlug | null {
  if (raw && VALID_SUBJECTS.includes(raw as SubjectSlug)) {
    return raw as SubjectSlug;
  }
  return null;
}

function SmartNotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSubject = parseSubjectSlug(searchParams.get('subject'));
  const paramNoteId = searchParams.get('noteId');

  const [screen, setScreen] = useState<ScreenState<NoteItem[]>>({
    status: 'loading',
  });
  const [activeFolder, setActiveFolder] = useState<'all' | SubjectSlug>(
    () => paramSubject ?? 'all'
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftContent, setDraftContent] = useState<string>('');
  const deferredDraftContent = useDeferredValue(draftContent);
  const [draftSubject, setDraftSubject] = useState<SubjectSlug>(
    () => paramSubject ?? 'bio'
  );
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [creatingNote, setCreatingNote] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const creatingNoteRef = useRef(false);
  const paramSubjectRef = useRef(paramSubject);
  const paramNoteIdRef = useRef(paramNoteId);
  const lastSyncedParamNoteIdRef = useRef<string | null>(null);
  const routerRef = useRef(router);
  routerRef.current = router;
  paramSubjectRef.current = paramSubject;
  paramNoteIdRef.current = paramNoteId;

  const selectNote = useCallback((note: NoteItem) => {
    setSelectedNoteId(note.id);
    setDraftTitle(note.title);
    setDraftContent(note.contentMarkdown);
    setDraftSubject(note.subjectSlug);
    setSaveState('idle');
    setActionError(null);
  }, []);

  const loadNotes = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setScreen({ status: 'loading' });
    setActionError(null);
    fetch('/api/notes', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Unable to load Smart Notes.');
        }
        return (await res.json()) as { notes?: NoteItem[] };
      })
      .then((json) => {
        if (!json) return;
        const list = json.notes ?? [];
        setScreen({ status: 'success', data: list });
        if (list.length > 0) {
          const initialNoteId = paramNoteIdRef.current;
          const initialSubject = paramSubjectRef.current;
          const matchedById = initialNoteId
            ? list.find((n) => n.id === initialNoteId)
            : undefined;
          const matchedBySubject = initialSubject
            ? list.find((n) => n.subjectSlug === initialSubject)
            : undefined;
          const target = matchedById ?? matchedBySubject ?? list[0];
          if (matchedById && initialNoteId) {
            lastSyncedParamNoteIdRef.current = initialNoteId;
          }
          selectNote(target);
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setScreen({
          status: 'error',
          message: 'Unable to load Smart Notes.',
        });
      });
  }, [selectNote]);

  useEffect(() => {
    loadNotes();
    return () => controllerRef.current?.abort();
  }, [loadNotes]);

  useEffect(() => {
    if (paramSubject) {
      setActiveFolder(paramSubject);
    }
  }, [paramSubject]);

  useEffect(() => {
    if (
      screen.status === 'success' &&
      paramNoteId &&
      paramNoteId !== lastSyncedParamNoteIdRef.current
    ) {
      const match = screen.data.find((n) => n.id === paramNoteId);
      if (match) {
        lastSyncedParamNoteIdRef.current = paramNoteId;
        selectNote(match);
      }
    }
  }, [paramNoteId, screen, selectNote]);

  const filteredNotes = useMemo(() => {
    if (screen.status !== 'success') return [];
    const list =
      activeFolder === 'all'
        ? screen.data
        : screen.data.filter((n) => n.subjectSlug === activeFolder);
    return [...list].sort((a, b) => b.isPinned - a.isPinned || b.updatedAt - a.updatedAt);
  }, [screen, activeFolder]);

  const activeNote = useMemo(() => {
    if (screen.status !== 'success') return null;
    return screen.data.find((n) => n.id === selectedNoteId) ?? null;
  }, [screen, selectedNoteId]);

  async function handleCreateNewNote() {
    if (screen.status !== 'success' || creatingNoteRef.current) return;
    creatingNoteRef.current = true;
    setCreatingNote(true);
    const targetSubject: SubjectSlug =
      activeFolder === 'all' ? draftSubject : activeFolder;
    setActionError(null);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectSlug: targetSubject,
          title: `New ${targetSubject.toUpperCase()} Study Note`,
          contentMarkdown:
            '## Key Definitions & Equations\nWrite your IB markscheme points here with inline KaTeX like $\\Delta H^\\ominus = \\sum E(\\text{bonds broken}) - \\sum E(\\text{bonds formed})$.',
          isPinned: false,
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.note) {
        throw new Error(json.error || 'Could not create study note.');
      }
      const created: NoteItem = json.note;
      setScreen((prev) =>
        prev.status === 'success'
          ? { status: 'success', data: [created, ...prev.data] }
          : prev
      );
      selectNote(created);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to create study note.'
      );
    } finally {
      creatingNoteRef.current = false;
      setCreatingNote(false);
    }
  }

  async function handleSaveNote() {
    if (!activeNote || screen.status !== 'success') return;
    setSaveState('saving');
    setActionError(null);
    try {
      const res = await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeNote.id,
          title: draftTitle,
          contentMarkdown: draftContent,
          subjectSlug: draftSubject,
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not save note.');
      }
      setScreen({
        status: 'success',
        data: screen.data.map((n) =>
          n.id === activeNote.id
            ? {
                ...n,
                title: draftTitle,
                contentMarkdown: draftContent,
                subjectSlug: draftSubject,
                excerpt: draftContent.slice(0, 120),
                updatedAt: Date.now(),
              }
            : n
        ),
      });
      setSaveState('saved');
    } catch (err) {
      setSaveState('error');
      setActionError(
        err instanceof Error ? err.message : 'Failed to save note changes.'
      );
    }
  }

  async function handleTogglePin(note: NoteItem) {
    if (screen.status !== 'success') return;
    const previous = screen.data;
    const nextPinned = note.isPinned ? 0 : 1;
    setActionError(null);
    setScreen({
      status: 'success',
      data: previous.map((n) =>
        n.id === note.id ? { ...n, isPinned: nextPinned } : n
      ),
    });
    try {
      const res = await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: note.id, isPinned: Boolean(nextPinned) }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Could not update pin state.');
      }
    } catch {
      setScreen({ status: 'success', data: previous });
      setActionError('Could not update pin status. Please try again.');
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (screen.status !== 'success') return;
    const previous = screen.data;
    const prevSelected = selectedNoteId;
    const remaining = previous.filter((n) => n.id !== noteId);
    setActionError(null);
    setScreen({ status: 'success', data: remaining });
    if (remaining.length > 0) {
      selectNote(remaining[0]);
    } else {
      setSelectedNoteId('');
      setDraftTitle('');
      setDraftContent('');
    }
    try {
      const res = await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: noteId }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Could not delete note.');
      }
    } catch {
      setScreen({ status: 'success', data: previous });
      const prevNote = previous.find((n) => n.id === prevSelected);
      if (prevNote) selectNote(prevNote);
      setActionError('Could not delete note. Please try again.');
    }
  }

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E4E7] pb-5 sm:flex-row sm:items-center">
          <div>
            <h1
              className="h-title !text-[24px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Smart Notes &amp; KaTeX Notebook
            </h1>
            <p className="text-[13px] text-[#71717A] mt-0.5">
              Organize IB syllabus summaries, LaTeX formulas, and markscheme tables across all 6 subjects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/essay-studio"
              className="pill-btn"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in AI Essay Studio</span>
            </Link>
            <button
              type="button"
              onClick={handleCreateNewNote}
              disabled={screen.status !== 'success' || creatingNote}
              className="pill-btn-dark"
            >
              <Plus className="h-4 w-4" />
              <span>{creatingNote ? 'Creating...' : 'New Note'}</span>
            </button>
          </div>
        </div>

        {/* Subject Folder Pills */}
        <div
          role="tablist"
          aria-label="Filter notes by subject"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          {SUBJECT_FOLDERS.map((folder) => {
            const isSelected = activeFolder === folder.slug;
            return (
              <button
                key={folder.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFolder(folder.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  isSelected
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E4E4E7] bg-white text-[#3F3F46] hover:bg-[#F4F4F5]'
                }`}
              >
                {folder.label}
              </button>
            );
          })}
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12.5px] font-medium text-[#B91C1C]"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
              <span>{actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="pill-btn !text-[11px] !py-1 !px-2.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {screen.status === 'loading' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="h-96 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white lg:col-span-4" />
            <div className="h-96 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white lg:col-span-8" />
          </div>
        )}

        {screen.status === 'error' && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between flex-wrap gap-3 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[13px] text-[#B91C1C]"
          >
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
              <span>{screen.message}</span>
            </div>
            <button
              type="button"
              onClick={loadNotes}
              className="pill-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {screen.status === 'success' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Note Cards Sidebar */}
            <div className="space-y-2.5 lg:col-span-4">
              {filteredNotes.length === 0 ? (
                <div className="hairline-card p-6 text-center">
                  <FileText className="mx-auto h-7 w-7 text-[#71717A]" />
                  <p className="mt-2 text-[13px] font-semibold text-[#18181B]">
                    No notes yet
                  </p>
                  <p className="mt-1 text-[12px] text-[#71717A]">
                    Create your first IB study note with LaTeX math and markscheme checklists.
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateNewNote}
                    className="pill-btn-dark mt-3"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Note</span>
                  </button>
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = note.id === selectedNoteId;
                  return (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectNote(note);
                        }
                      }}
                      className={`cursor-pointer rounded-[12px] border p-4 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                        isSelected
                          ? 'border-[#18181B] bg-[#18181B] text-white'
                          : 'border-[#E4E4E7] bg-white text-[#18181B] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isSelected
                              ? 'bg-white/15 text-white'
                              : 'bg-[#F4F4F5] text-[#3F3F46]'
                          }`}
                        >
                          {note.subjectSlug.toUpperCase()}
                        </span>
                        {note.isPinned === 1 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706]">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </span>
                        )}
                      </div>
                      <KaTeXText
                        text={note.title}
                        className="mt-2 text-xs font-bold leading-snug"
                      />
                      <p
                        className={`mt-1.5 line-clamp-2 text-[11px] ${
                          isSelected ? 'text-zinc-300' : 'text-[#71717A]'
                        }`}
                      >
                        {note.excerpt}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Split Markdown + KaTeX Editor & Live Preview */}
            <div className="hairline-card lg:col-span-8">
              {!activeNote ? (
                <div className="flex h-72 flex-col items-center justify-center text-center px-4">
                  <FileText className="h-8 w-8 text-[#71717A]" />
                  <h2
                    className="mt-3 text-[15px] font-semibold text-[#18181B]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {screen.data.length === 0
                      ? 'Your Smart Notes notebook is blank'
                      : 'Select or create a study note'}
                  </h2>
                  <p className="mt-1 max-w-sm text-[12.5px] text-[#71717A]">
                    {screen.data.length === 0
                      ? 'Start by creating a note with live KaTeX math preview and Markdown headings.'
                      : 'Choose a note from the list on the left or create a new one.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateNewNote}
                    className="pill-btn-dark mt-4"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Study Note</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F4F4F5] pb-4">
                    <input
                      type="text"
                      aria-label="Note Title"
                      value={draftTitle}
                      onChange={(e) => {
                        setDraftTitle(e.target.value);
                        setSaveState('idle');
                      }}
                      className="min-w-0 w-full sm:w-auto sm:flex-1 rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-sm font-semibold text-[#18181B] transition-colors duration-150 focus:border-[#18181B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        aria-label="Note Subject"
                        value={draftSubject}
                        onChange={(e) => {
                          setDraftSubject(e.target.value as SubjectSlug);
                          setSaveState('idle');
                        }}
                        className="rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#18181B] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                      >
                        {SUBJECT_ONLY_OPTIONS.map((opt) => (
                          <option key={opt.slug} value={opt.slug}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleTogglePin(activeNote)}
                        aria-pressed={Boolean(activeNote.isPinned)}
                        className={`pill-btn ${
                          activeNote.isPinned
                            ? '!border-[#FCD34D] !bg-[#FEF3C7] !text-[#92400E]'
                            : ''
                        }`}
                      >
                        <Pin className="h-3.5 w-3.5" />
                        <span>{activeNote.isPinned ? 'Pinned' : 'Pin'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveNote}
                        disabled={saveState === 'saving'}
                        className="pill-btn-dark"
                      >
                        {saveState === 'saved' ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Saved</span>
                          </>
                        ) : saveState === 'saving' ? (
                          <span>Saving...</span>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            <span>Save Note</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteNote(activeNote.id)}
                        aria-label={`Delete note ${activeNote.title}`}
                        className="rounded-lg border border-[#E4E4E7] p-1.5 text-[#71717A] transition-colors duration-150 hover:bg-[#FEF2F2] hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Markdown + LaTeX Source */}
                    <div>
                      <label
                        htmlFor="notes-markdown-editor"
                        className="block text-[11px] font-bold uppercase tracking-wider text-[#71717A]"
                      >
                        Markdown + KaTeX Editor ($...$)
                      </label>
                      <textarea
                        id="notes-markdown-editor"
                        rows={14}
                        value={draftContent}
                        onChange={(e) => {
                          setDraftContent(e.target.value);
                          setSaveState('idle');
                        }}
                        className="mt-2 w-full rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 font-mono text-xs leading-relaxed text-[#18181B] transition-colors duration-150 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                      />
                    </div>

                    {/* Rendered KaTeX Preview */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                        Live Rendered Preview
                      </span>
                      <div className="mt-2 min-h-[290px] rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
                        <KaTeXText
                          text={deferredDraftContent}
                          className="text-xs leading-relaxed text-[#27272A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SmartNotesSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center space-y-5">
        <div className="h-8 w-72 animate-pulse rounded-lg bg-[#E4E4E7]" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-96 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white lg:col-span-4" />
          <div className="h-96 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white lg:col-span-8" />
        </div>
      </div>
    </div>
  );
}

export default function SmartNotesPage() {
  return (
    <Suspense fallback={<SmartNotesSkeleton />}>
      <SmartNotesContent />
    </Suspense>
  );
}
