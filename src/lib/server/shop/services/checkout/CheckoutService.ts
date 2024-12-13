import type { Size } from "$lib/types/shop/product/clothing";
import type { Bag, ItemDetails } from "$lib/types/shop/state/bag";
import type { Order, OrderItem } from "@prisma/client";
import { ShopRepository } from "../../repository/ShopRepository";
import type { Country } from "$lib/shared/locations/countries";

export class CheckoutService {
  private static instance: CheckoutService
  private shopRepository: ShopRepository;

  constructor() {
    this.shopRepository = ShopRepository.getInstance();
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
          productId: itemDetail.id,
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
  }
}
