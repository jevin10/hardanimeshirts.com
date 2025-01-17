import type { Bag, ItemDetails } from "$lib/types/shop/state/bag";
import type { Order, OrderItem } from "@prisma/client";
import { ShopRepository } from "../../repository/ShopRepository";
import type { Country } from "$lib/shared/locations/countries";
import { StripeService } from "$lib/server/stripe/StripeService";
import { getShippingZone } from "$lib/shared/shop/shippingUtils";
import { stripe } from "$lib/server/stripe/stripe";
import prisma from "$lib/prisma";

export class CheckoutService {
  private static instance: CheckoutService
  private shopRepository: ShopRepository;
  private stripeService: StripeService;

  constructor() {
    this.shopRepository = ShopRepository.getInstance();
    this.stripeService = StripeService.getInstance();
  }

  public static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService();
    }
    return CheckoutService.instance;
  }

  async checkout(bag: ItemDetails[], userId: string | null, location: Country) {
    console.log('creating orders in db...');
    // if no userId, associate with anonymous user
    if (!userId) {
      userId = 'jdqlhlajrc2z3wua';
    }
    // create a products array with all the prices verified from the db
    const products = await Promise.all(
      bag.map(async (itemDetail) => {
        const product = await this.shopRepository.getClothingProduct(itemDetail.id);

        return {
          name: product.name ?? 'Untitled',
          description: product.description ?? '',
          image: product.images[0],
          productId: product.id,
          price: product.price,
          details: itemDetail.size
        };
      })
    );

    // create order in db
    const order: {
      Order: Order,
      OrderItems: OrderItem[]
    } = await this.shopRepository.createOrder(userId, products);

    console.log('Order created!');

    return await StripeService.getInstance().createCheckoutSession(products, order.OrderItems, order.Order.id, getShippingZone(location));
  }

  async fulfillCheckout(sessionId: string) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // check if order is paid
    if (checkoutSession.payment_status !== 'unpaid') {
      const orderId: string | null = checkoutSession.client_reference_id;
      if (!orderId) {
        throw new Error('No order ID');
      }
      // update the order status in the database
      await prisma.order.update({
        where: {
          id: orderId
        },
        data: {
          paid: true,
          updatedAt: new Date()
        }
      });
    }
  }
}
