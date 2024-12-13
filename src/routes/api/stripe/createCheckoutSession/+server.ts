import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  let userId: string | null;
  if (!locals.user) {
    userId = null;
  } else {
    userId = locals.user.id;
  }
}
