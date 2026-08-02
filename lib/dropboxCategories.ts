// Kept separate from lib/dropbox.ts so client components can import just the
// category list without pulling the server-only Dropbox SDK into the bundle.
export const DOCUMENT_CATEGORIES = ['Tax', 'Immigration', 'Company Registration', 'Other'] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];
