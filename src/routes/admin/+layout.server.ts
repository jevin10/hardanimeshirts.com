import { goto } from "$app/navigation";
import { requireUser } from "$lib/server/auth";
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async (event) => {
  try {
    await requireUser(event, '55eh4pcobzaqzej7');
    return {};
  } catch (err) {
    throw redirect(303, '/');
  }
};
