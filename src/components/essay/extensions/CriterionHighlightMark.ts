import { Mark, mergeAttributes } from '@tiptap/core';

export interface CriterionHighlightOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    criterionHighlight: {
      setCriterionHighlight: (attributes: {
        annotationId: string;
        criterion: string;
        comment?: string;
      }) => ReturnType;
      unsetCriterionHighlight: () => ReturnType;
    };
  }
}

export const CriterionHighlightMark = Mark.create<CriterionHighlightOptions>({
  name: 'criterionHighlight',
  inclusive: false,
  excludes: '',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      annotationId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-annotation-id'),
        renderHTML: (attributes) => {
          if (!attributes.annotationId) return {};
          return { 'data-annotation-id': String(attributes.annotationId) };
        },
      },
      criterion: {
        default: 'Criterion B',
        parseHTML: (element) => element.getAttribute('data-criterion') || 'Criterion B',
        renderHTML: (attributes) => ({
          'data-criterion': String(attributes.criterion ?? 'Criterion B'),
        }),
      },
      comment: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-comment') || '',
        renderHTML: (attributes) => {
          if (!attributes.comment) return {};
          return { 'data-comment': String(attributes.comment) };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-criterion-highlight]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-criterion-highlight': 'true',
        style:
          'background:#FEF3C7;border-bottom:2px solid #D97706;padding:1px 3px;border-radius:2px;cursor:pointer;',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCriterionHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetCriterionHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
