"use server";

import { getUserSafeFilterStatus } from "@/app/_api/safeFilter.server";
import {
  getNovelsForGenreList,
  getRecommendedNovels,
  getNovelsByView,
} from "./novelList.server";

export async function getPersonalizedHomeLists() {
  const { safeFilterEnabled } = await getUserSafeFilterStatus();

  // If safe filter is enabled for the user, no need to re-fetch,
  // as the initial static page is already the safe version.
  if (safeFilterEnabled) {
    return null;
  }

  // If safe filter is OFF, fetch all lists again with the filter disabled.
  const [genre, recommended, top] = await Promise.all([
    getNovelsForGenreList({ safeFilter: false }),
    getRecommendedNovels({ safeFilter: false }), // This will become personalized later
    getNovelsByView({ safeFilter: false }),
  ]);

  return { genre, recommended, top };
}
