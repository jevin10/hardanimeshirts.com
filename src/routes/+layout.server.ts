import { imageboardService } from "$lib/server/imageboard/ImageboardService";
import type { posts_new } from "@prisma/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  let initialPosts: posts_new[] = [];

  try {
    initialPosts = await imageboardService.getContent(null, 1, 5);

    // check if there's a user logged in
    if (locals.user) {
      console.log('User exists');
    }
  } catch (err) {
    console.error('Error fetching initial posts:', err);
  }

  return {
    user: locals.user,
    session: locals.session,
    initialPosts: initialPosts
  };
};
