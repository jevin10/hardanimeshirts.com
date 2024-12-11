import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  return {
    productId: Number(params.productId)
  };
};
