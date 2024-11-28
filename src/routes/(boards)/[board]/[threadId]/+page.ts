import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  return {
    threadId: Number(params.threadId)
  };
};
