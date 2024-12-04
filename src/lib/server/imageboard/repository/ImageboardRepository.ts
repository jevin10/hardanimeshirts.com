import type { CreatePostPayload } from "$lib/types/ws/actions/schemas";
import type { posts_new } from "@prisma/client";

// Interacts with the database to get imageboard data
export default interface ImageboardRepository {
  getContent(boardId: number | null, page: number, limit: number, threadId?: number): Promise<posts_new[]>;
  uploadPost(params: CreatePostPayload): Promise<posts_new>;
}
