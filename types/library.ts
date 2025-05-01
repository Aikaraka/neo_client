interface LibraryNovel {
  novel_id: string;
  title: string;
  cover_image: string | null;
  progress_rate: number;
  last_viewed_at: string | null;
}

export type { LibraryNovel };
