import { z } from 'zod';

export const SubjectSlugSchema = z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']);
export type SubjectSlug = z.infer<typeof SubjectSlugSchema>;

export const SubjectToolCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  bgHex: z.string().min(4),
  colorHex: z.string().min(4),
  href: z.string().min(1),
  iconName: z.enum([
    'questionbank',
    'visualizations',
    'blurting',
    'teach_sprout',
    'exam_builder',
    'mistakes_log',
    'study_guide',
    'flashcards',
    'cheatsheets',
    'essay_studio',
    'data_booklet',
    'calc_checker',
    'opcvl',
    'outline',
    'timeline',
    'literary_device',
    'global_issue',
    'text_type',
    'grammar_lab',
    'formula_booklet',
    'walkthrough',
  ]),
});

export const CourseworkCriterionSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  maxMarks: z.number().int().positive(),
  weightPercent: z.number().optional(),
  summary: z.string().min(1),
  topBandExpectations: z.array(z.string()).min(1),
  commonPitfalls: z.array(z.string()).min(1),
});

export const CourseworkExemplarSectionSchema = z.object({
  sectionTitle: z.string().min(1),
  excerptMarkdown: z.string().min(1),
  examinerCommentary: z.string().min(1),
  criterionRef: z.string().min(1),
});

export const SubjectConfigSchema = z.object({
  slug: SubjectSlugSchema,
  name: z.string().min(1),
  level: z.enum(['HL', 'SL']),
  syllabusFirstAssessment: z.string().min(4),
  themeTokens: z.object({
    wash1: z.string().min(1),
    wash2: z.string().min(1),
    wash3: z.string().min(1),
    accent: z.string().min(4),
    soft: z.string().min(4),
    cardGradient: z.string().min(1),
  }),
  iaConfig: z.object({
    iaLabel: z.string().min(1),
    iaTitle: z.string().min(1),
    maxMarks: z.number().int().positive(),
    wordOrTimeLimit: z.string().min(1),
    weightPercent: z.number(),
    steps: z.tuple([z.string(), z.string(), z.string()]),
    criteria: z.array(CourseworkCriterionSchema).min(3),
    exemplarTitle: z.string().min(1),
    exemplarResearchQuestion: z.string().min(1),
    exemplarScore: z.string().min(1),
    exemplarSections: z.array(CourseworkExemplarSectionSchema).min(2),
  }),
  spotlight: z.object({
    title: z.string().min(1),
    pills: z.array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    ).min(3),
  }),
  practiceTools: z.array(SubjectToolCardSchema).length(6),
  learnTools: z.array(SubjectToolCardSchema).length(4),
});

export const UnderstandingItemSchema = z.object({
  code: z.string().min(1),
  text: z.string().min(1),
  isHL: z.boolean().default(false),
});

export const SyllabusTopicSchema = z.object({
  id: z.string().min(1),
  subjectSlug: SubjectSlugSchema,
  unitCode: z.string().min(1),
  unitTitle: z.string().min(1),
  code: z.string().min(1),
  title: z.string().min(1),
  levelScope: z.enum(['SL/Core', 'HL Extension', 'HL Only']),
  recommendedHours: z.number().positive(),
  guidingQuestions: z.array(z.string()).min(1),
  understandings: z.array(UnderstandingItemSchema).min(2),
  studyGuideMarkdown: z.string().min(40),
  cheatsheetMarkdown: z.string().min(30),
  blurtChecklist: z.array(z.string().min(3)).min(4),
});

export const MarkschemePointSchema = z.object({
  pointId: z.string().min(1),
  requirement: z.string().min(1),
  marks: z.number().int().positive(),
  notes: z.string().optional(),
});

export const WalkthroughStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  title: z.string().min(1),
  explanationMarkdown: z.string().min(1),
});

export const FunctionGraphDiagramSchema = z
  .object({
    kind: z.literal('function_graph'),
    title: z.string().min(1).max(160).optional(),
    xRange: z.tuple([z.number().finite(), z.number().finite()]),
    yRange: z.tuple([z.number().finite(), z.number().finite()]),
    xLabel: z.string().default('x'),
    yLabel: z.string().default('y'),
    functions: z
      .array(
        z.object({
          id: z.string().min(1),
          expr: z.string().min(1),
          label: z.string().min(1),
          color: z.string().optional(),
          dashed: z.boolean().optional(),
          domain: z.tuple([z.number().finite(), z.number().finite()]).optional(),
        })
      )
      .min(1),
    asymptotes: z
      .array(
        z.object({
          axis: z.enum(['x', 'y']),
          value: z.number().finite(),
          label: z.string().optional(),
        })
      )
      .optional(),
    shadedRegion: z
      .object({
        exprTop: z.string().min(1),
        exprBottom: z.string().optional(),
        fromX: z.number().finite(),
        toX: z.number().finite(),
        label: z.string().optional(),
      })
      .optional(),
    tangentAtX: z
      .object({
        fnIndex: z.number().int().nonnegative().default(0),
        x: z.number().finite(),
        showNormal: z.boolean().optional(),
        label: z.string().optional(),
      })
      .optional(),
    keyPoints: z
      .array(
        z.object({
          x: z.number().finite(),
          y: z.number().finite(),
          label: z.string().min(1),
        })
      )
      .optional(),
    interactiveTrace: z.boolean().default(true),
  })
  .superRefine((g, ctx) => {
    if (g.xRange[0] >= g.xRange[1]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['xRange'],
        message: 'xRange[0] must be less than xRange[1].',
      });
    }
    if (g.yRange[0] >= g.yRange[1]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['yRange'],
        message: 'yRange[0] must be less than yRange[1].',
      });
    }
    if (g.shadedRegion && g.shadedRegion.fromX >= g.shadedRegion.toX) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['shadedRegion'],
        message: 'shadedRegion.fromX must be less than toX.',
      });
    }
  });

export const GeometryFigureDiagramSchema = z.object({
  kind: z.literal('geometry_figure'),
  title: z.string().min(1).max(160).optional(),
  viewBox: z
    .tuple([
      z.number().finite(),
      z.number().finite(),
      z.number().positive(),
      z.number().positive(),
    ])
    .default([0, 0, 360, 240]),
  vertices: z
    .array(
      z.object({
        id: z.string().min(1),
        x: z.number().finite(),
        y: z.number().finite(),
        label: z.string().min(1),
        note: z.string().optional(),
      })
    )
    .min(2),
  segments: z
    .array(
      z.object({
        from: z.string().min(1),
        to: z.string().min(1),
        label: z.string().optional(),
        dashed: z.boolean().optional(),
        highlight: z.boolean().optional(),
      })
    )
    .min(1),
  polygons: z
    .array(
      z.object({
        vertexIds: z.array(z.string().min(1)).min(3),
        fill: z.string().optional(),
      })
    )
    .optional(),
  rightAngles: z
    .array(
      z.object({
        vertex: z.string().min(1),
        armA: z.string().min(1),
        armB: z.string().min(1),
      })
    )
    .optional(),
  angleArcs: z
    .array(
      z.object({
        vertex: z.string().min(1),
        armA: z.string().min(1),
        armB: z.string().min(1),
        label: z.string().min(1),
        highlight: z.boolean().optional(),
      })
    )
    .optional(),
  circles: z
    .array(
      z.object({
        cx: z.number().finite(),
        cy: z.number().finite(),
        r: z.number().positive(),
        sectorStartDeg: z.number().finite().optional(),
        sectorEndDeg: z.number().finite().optional(),
        sectorLabel: z.string().optional(),
      })
    )
    .optional(),
});

export const UnitCircleDiagramSchema = z.object({
  kind: z.literal('unit_circle'),
  title: z.string().min(1).max(160).optional(),
  targetAnglesRad: z.array(z.number().finite()).min(1).max(4),
  angleLabels: z.array(z.string()).optional(),
  highlightQuadrants: z.array(z.number().int().min(1).max(4)).optional(),
  showExactValues: z.boolean().default(false),
  questionMode: z
    .enum(['angle_value', 'solve_trig', 'arc_sector'])
    .default('angle_value'),
});

export const ProbabilityTreeDiagramSchema = z.object({
  kind: z.literal('probability_tree'),
  title: z.string().min(1).max(160).optional(),
  rootLabel: z.string().default('Start'),
  branches: z
    .array(
      z.object({
        label: z.string().min(1),
        probDisplay: z.string().min(1),
        probValue: z.number().min(0).max(1).nullable().optional(),
        children: z
          .array(
            z.object({
              label: z.string().min(1),
              probDisplay: z.string().min(1),
              probValue: z.number().min(0).max(1).nullable().optional(),
              outcomeNote: z.string().optional(),
            })
          )
          .min(2),
      })
    )
    .min(2),
});

export const VennDiagramSchema = z.object({
  kind: z.literal('venn_diagram'),
  title: z.string().min(1).max(160).optional(),
  universeLabel: z.string().default('U'),
  setALabel: z.string().default('A'),
  setBLabel: z.string().default('B'),
  regions: z.object({
    aOnly: z.string().min(1),
    intersection: z.string().min(1),
    bOnly: z.string().min(1),
    outside: z.string().min(1),
  }),
  highlightRegion: z
    .enum(['aOnly', 'intersection', 'bOnly', 'outside', 'union', 'none'])
    .default('none'),
});

export const NormalCurveDiagramSchema = z.object({
  kind: z.literal('normal_curve'),
  title: z.string().min(1).max(160).optional(),
  mean: z.number().finite(),
  sd: z.number().positive(),
  variableName: z.string().default('X'),
  shadedIntervals: z
    .array(
      z.object({
        from: z.number().finite(),
        to: z.number().finite(),
        label: z.string().optional(),
      })
    )
    .min(1),
  markers: z
    .array(
      z.object({
        x: z.number().finite(),
        label: z.string().min(1),
      })
    )
    .optional(),
});

export const StatsPlotDiagramSchema = z.object({
  kind: z.literal('stats_plot'),
  subtype: z.enum([
    'scatter_regression',
    'box_plot',
    'cumulative_ogive',
    'histogram',
  ]),
  title: z.string().min(1).max(160).optional(),
  xLabel: z.string().min(1),
  yLabel: z.string().min(1),
  points: z
    .array(
      z.object({
        x: z.number().finite(),
        y: z.number().finite(),
        label: z.string().optional(),
      })
    )
    .optional(),
  regressionLine: z
    .object({
      slope: z.number().finite(),
      intercept: z.number().finite(),
      label: z.string().optional(),
    })
    .optional(),
  boxSummary: z
    .object({
      min: z.number().finite(),
      q1: z.number().finite(),
      median: z.number().finite(),
      q3: z.number().finite(),
      max: z.number().finite(),
      outliers: z.array(z.number().finite()).optional(),
    })
    .optional(),
  bins: z
    .array(
      z.object({
        xStart: z.number().finite(),
        xEnd: z.number().finite(),
        count: z.number().nonnegative(),
      })
    )
    .optional(),
});

export const MathDiagramSpecSchema = z.union([
  FunctionGraphDiagramSchema,
  GeometryFigureDiagramSchema,
  UnitCircleDiagramSchema,
  ProbabilityTreeDiagramSchema,
  VennDiagramSchema,
  NormalCurveDiagramSchema,
  StatsPlotDiagramSchema,
]);

export type MathDiagramSpec = z.infer<typeof MathDiagramSpecSchema>;

export const QuestionItemSchema = z
  .object({
    id: z.string().min(1),
    subjectSlug: SubjectSlugSchema,
    topicId: z.string().min(1),
    subtopicCode: z.string().min(1).optional(),
    paper: z.enum(['Paper 1', 'Paper 1A', 'Paper 1B', 'Paper 2', 'Paper 3']),
    questionType: z.enum([
      'mcq',
      'short_answer',
      'data_based',
      'extended_response',
      'source_opcvl',
    ]),
    calculatorPolicy: z.enum(['allowed', 'non_calculator', 'gdc_required']),
    difficulty: z.enum(['foundation', 'standard', 'challenging']),
    marks: z.number().int().positive(),
    commandTerm: z.string().min(1),
    stemMarkdown: z.string().min(10),
    stimulusMarkdown: z.string().nullable().optional(),
    diagramSpec: MathDiagramSpecSchema.nullable().optional(),
    options: z
      .array(
        z.object({
          id: z.enum(['A', 'B', 'C', 'D']),
          text: z.string().min(1),
        })
      )
      .length(4)
      .nullable()
      .optional(),
    correctOptionId: z.enum(['A', 'B', 'C', 'D']).nullable().optional(),
    markschemePoints: z.array(MarkschemePointSchema).min(1),
    walkthroughSteps: z.array(WalkthroughStepSchema).min(2),
    commonPitfalls: z.array(z.string()).min(1),
    isDailyEligible: z.boolean().default(true),
  })
  .superRefine((q, ctx) => {
    if (q.questionType === 'mcq') {
      if (!q.options || q.options.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'MCQ questions must define exactly 4 options.',
        });
      }
      if (!q.correctOptionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['correctOptionId'],
          message: 'MCQ questions must specify correctOptionId.',
        });
      }
    } else if (q.options || q.correctOptionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: 'Non-MCQ questions must not define options or correctOptionId.',
      });
    }

    const markSum = q.markschemePoints.reduce((sum, pt) => sum + pt.marks, 0);
    if (markSum !== q.marks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['markschemePoints'],
        message: `markschemePoints sum (${markSum}) must equal question marks (${q.marks}).`,
      });
    }
  });

export const ReferenceItemSchema = z.object({
  id: z.string().min(1),
  subjectSlug: SubjectSlugSchema,
  toolType: z.enum([
    'data_booklet',
    'periodic_table',
    'calc_checker',
    'formula_booklet',
    'bio_diagram',
    'opcvl_source',
    'historiography_timeline',
    'essay_outline',
    'literary_device',
    'global_issue',
    'text_type_drill',
    'grammar_lab',
  ]),
  category: z.string().min(1),
  title: z.string().min(1),
  codeOrSymbol: z.string().nullable().optional(),
  payload: z.record(z.unknown()),
});

export const FlashcardItemSchema = z.object({
  id: z.string().min(1),
  frontMarkdown: z.string().min(2),
  backMarkdown: z.string().min(2),
  tags: z.array(z.string()).default([]),
});

export const FlashcardDeckSchema = z.object({
  id: z.string().min(1),
  subjectSlug: SubjectSlugSchema,
  topicId: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  cards: z.array(FlashcardItemSchema).min(4),
});

export const SubjectPackSchema = z
  .object({
    subject: SubjectConfigSchema,
    topics: z.array(SyllabusTopicSchema).min(6),
    questions: z.array(QuestionItemSchema).min(6),
    referenceItems: z.array(ReferenceItemSchema).min(3),
    flashcardDecks: z.array(FlashcardDeckSchema).min(1),
  })
  .superRefine((pack, ctx) => {
    const slug = pack.subject.slug;
    const criteriaMarks = pack.subject.iaConfig.criteria.reduce(
      (sum, c) => sum + c.maxMarks,
      0
    );
    if (criteriaMarks !== pack.subject.iaConfig.maxMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subject', 'iaConfig', 'criteria'],
        message: `IA criteria maxMarks sum (${criteriaMarks}) must equal iaConfig.maxMarks (${pack.subject.iaConfig.maxMarks}).`,
      });
    }

    const topicIds = new Set<string>();
    pack.topics.forEach((topic, idx) => {
      if (topic.subjectSlug !== slug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['topics', idx, 'subjectSlug'],
          message: `Topic ${topic.id} subjectSlug (${topic.subjectSlug}) does not match pack (${slug}).`,
        });
      }
      if (topicIds.has(topic.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['topics', idx, 'id'],
          message: `Duplicate topic id: ${topic.id}`,
        });
      }
      topicIds.add(topic.id);
    });

    const questionIds = new Set<string>();
    pack.questions.forEach((q, idx) => {
      if (q.subjectSlug !== slug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['questions', idx, 'subjectSlug'],
          message: `Question ${q.id} subjectSlug (${q.subjectSlug}) does not match pack (${slug}).`,
        });
      }
      if (!topicIds.has(q.topicId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['questions', idx, 'topicId'],
          message: `Question ${q.id} references missing topicId: ${q.topicId}`,
        });
      }
      if (questionIds.has(q.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['questions', idx, 'id'],
          message: `Duplicate question id: ${q.id}`,
        });
      }
      questionIds.add(q.id);
    });

    const refIds = new Set<string>();
    pack.referenceItems.forEach((ref, idx) => {
      if (ref.subjectSlug !== slug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['referenceItems', idx, 'subjectSlug'],
          message: `ReferenceItem ${ref.id} subjectSlug (${ref.subjectSlug}) does not match pack (${slug}).`,
        });
      }
      if (refIds.has(ref.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['referenceItems', idx, 'id'],
          message: `Duplicate referenceItem id: ${ref.id}`,
        });
      }
      refIds.add(ref.id);
    });

    const deckIds = new Set<string>();
    const cardIds = new Set<string>();
    pack.flashcardDecks.forEach((deck, dIdx) => {
      if (deck.subjectSlug !== slug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['flashcardDecks', dIdx, 'subjectSlug'],
          message: `FlashcardDeck ${deck.id} subjectSlug (${deck.subjectSlug}) does not match pack (${slug}).`,
        });
      }
      if (deck.topicId && !topicIds.has(deck.topicId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['flashcardDecks', dIdx, 'topicId'],
          message: `FlashcardDeck ${deck.id} references missing topicId: ${deck.topicId}`,
        });
      }
      if (deckIds.has(deck.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['flashcardDecks', dIdx, 'id'],
          message: `Duplicate flashcardDeck id: ${deck.id}`,
        });
      }
      deckIds.add(deck.id);

      deck.cards.forEach((card, cIdx) => {
        if (cardIds.has(card.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['flashcardDecks', dIdx, 'cards', cIdx, 'id'],
            message: `Duplicate flashcard id: ${card.id}`,
          });
        }
        cardIds.add(card.id);
      });
    });
  });

export type SubjectConfig = z.infer<typeof SubjectConfigSchema>;
export type SyllabusTopic = z.infer<typeof SyllabusTopicSchema>;
export type QuestionItem = z.infer<typeof QuestionItemSchema>;
export type ReferenceItem = z.infer<typeof ReferenceItemSchema>;
export type FlashcardDeck = z.infer<typeof FlashcardDeckSchema>;
export type SubjectPack = z.infer<typeof SubjectPackSchema>;
