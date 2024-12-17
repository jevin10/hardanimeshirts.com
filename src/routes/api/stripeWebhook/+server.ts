import { env } from "$env/dynamic/private";
import { CheckoutService } from "$lib/server/shop/services/checkout/CheckoutService";
import { stripe } from "$lib/server/stripe/stripe";
import { error, json, type RequestHandler } from "@sveltejs/kit";

const checkoutService: CheckoutService = CheckoutService.getInstance();
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({ request }) => {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    if (!sig) {
      throw new Error('No signature provided');
    }

    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      throw error(400, { message: `Webhook error: ${err.message}` });
    }
    throw error(500, { message: 'Unknown error occurred' });
  }

  if (
    event.type === 'checkout.session.completed'
    || event.type === 'checkout.session.async_payment_succeeded'
  ) {
    checkoutService.fulfillCheckout(event.data.object.id);
  }
  return json({ status: 200 });
}
