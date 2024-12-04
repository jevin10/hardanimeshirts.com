import { lucia } from "$lib/server/auth";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals }) => {
  // check if there's a session
  if (!locals.session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // invalidate session
  await lucia.invalidateSession(locals.session.id);

  return json({ success: true });
}
