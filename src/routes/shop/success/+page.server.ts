import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AuthService } from "$lib/server/auth/AuthService";
import prisma from "$lib/prisma";

const authService: AuthService = AuthService.getInstance();

export const load: PageServerLoad = async ({ url }) => {
  const orderId = url.searchParams.get('orderId');
  let inviteCode: string | null = null

  if (!orderId) {
    throw error(400, 'Order ID is required');
  }

  try {
    console.log('getting order');
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId }
    });
    if (order.paid === true) {
      console.log('generating invite code');
      const result = await authService.generateInviteCode('jdqlhlajrc2z3wua');
      inviteCode = result.code;
    }
  } catch (err) {
    if (err instanceof Error) {
      throw error(400, 'Order could not be found!');
    }
  }

  return {
    inviteCode
  };
}
