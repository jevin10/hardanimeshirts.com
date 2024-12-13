import type { CheckoutService } from "$lib/server/shop/services/checkout/CheckoutService";
import { ShopService } from "$lib/server/shop/ShopService";
import type { Country } from "$lib/shared/locations/countries";
import type { Bag, ItemDetails } from "$lib/types/shop/state/bag";
import { error, json, redirect, type RequestHandler } from "@sveltejs/kit";

const shopService: ShopService = ShopService.getInstance();
const checkoutService: CheckoutService = shopService.getCheckoutService();

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Get user ID
    const userId = locals.user?.id ?? null;

    // Get and validate request body
    const body = await request.json();

    if (!body.bag || !body.location) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400
      });
    }

    const { bag, location }: { bag: ItemDetails[], location: Country } = body;

    console.log('checkout service checking out');
    // Now you can use userId, bag and location...
    const session = await checkoutService.checkout(bag, userId, location);

    if (!session.url) {
      throw new Error('Session failed to generate url');
    }

    console.log(JSON.stringify(session.url));

    return json({ url: session.url });
  } catch (err) {
    console.error('Failed to create checkout session:', err);
    throw error(500, { message: 'Unknown error occurered' });
  }
}
