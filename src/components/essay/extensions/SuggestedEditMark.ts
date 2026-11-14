import { Mark, mergeAttributes } from '@tiptap/core';

export interface SuggestedEditOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    suggestedEdit: {
      setSuggestedEdit: (attributes: {
        annotationId: string;
        replacementText: string;
        comment?: string;
      }) => ReturnType;
      unsetSuggestedEdit: () => ReturnType;
    };
  }
}

export const SuggestedEditMark = Mark.create<SuggestedEditOptions>({
  name: 'suggestedEdit',
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
      replacementText: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-replacement') || '',
        renderHTML: (attributes) => ({
          'data-replacement': String(attributes.replacementText ?? ''),
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
        tag: 'span[data-suggested-edit]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-suggested-edit': 'true',
        style:
          'background:#ECFDF5;border-bottom:2px solid #059669;padding:1px 4px;color:#065F46;border-radius:2px;cursor:pointer;',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setSuggestedEdit:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetSuggestedEdit:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
