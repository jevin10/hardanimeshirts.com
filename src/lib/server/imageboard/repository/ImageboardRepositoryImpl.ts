import type { posts_new } from "@prisma/client";
import type ImageboardRepository from "./ImageboardRepository";
import prisma from "../../../prisma";
import type { CreatePostPayload } from "$lib/types/ws/actions/schemas";
import { error } from "@sveltejs/kit";
import { uploadPostImage } from "$lib/server/s3/upload";
import { v4 } from "uuid";

export class ImageboardRepositoryImpl implements ImageboardRepository {
  /**
  * Retrieves posts and their replies based on provided parameters
  * 
  * Behavior:
  * - With threadId: Returns single thread and all its replies
  * - Without threadId: Returns paginated parent threads with all their replies
  * - With boardId: Filters content to specific board
  * - With null boardId: Returns content from all boards
  * 
  * @returns Promise<posts_new[]> Array of posts sorted with parents first, then replies
  */
  async getContent(boardId: number | null, page: number, limit: number, threadId?: number): Promise<posts_new[]> {
    if (threadId) {
      // Thread view: Single query to get specific thread and its replies
      // Orders by created_at to show conversation flow chronologically
      return await prisma.posts_new.findMany({
        where: {
          OR: [
            { id: threadId },       // Get the parent thread
            { parent_id: threadId } // Get all replies to this thread
          ]
        },
        orderBy: [{ created_at: 'asc' }],
        include: { posts_new: true }
      });
    } else {
      const skip = (page - 1) * limit;

      // Use transaction to ensure consistency between parent and reply queries
      return await prisma.$transaction(async (tx) => {
        // First query: Get parent threads with pagination
        // Orders by latest_activity to show most active threads first
        const parentThreads = await tx.posts_new.findMany({
          where: {
            parent_id: null,  // Only get threads (posts without parents)
            ...(boardId ? { board_id: boardId } : {}) // Filter by board if boardId provided
          },
          orderBy: [{ latest_activity: 'desc' }],
          skip,
          take: limit,
        });

        // Second query: Get all replies for the retrieved parent threads
        // Orders replies chronologically within each thread
        const replies = await tx.posts_new.findMany({
          where: {
            parent_id: { in: parentThreads.map(thread => thread.id) }
          },
          orderBy: [{ created_at: 'asc' }]
        });

        // Combine parents and replies, maintaining parent-first order
        return [...parentThreads, ...replies];
      });
    }
  }

  async uploadPost(params: CreatePostPayload): Promise<posts_new> {
    try {
      let imageUrl: string | null = null;

      // convert image into file buffer
      if (params.image) {
        const imageArray = new Uint8Array(Object.values(params.image));
        const buffer = Buffer.from(imageArray);
        const imageId: string = v4();

        // upload to s3 and get url
        imageUrl = await uploadPostImage(imageId, buffer);
      }

      // create post
      const newPost = await prisma.posts_new.create({
        data: {
          board_id: params.boardId,
          content: params.content,
          user_id: params.username,
          image_url: imageUrl,
          parent_id: params.parentId
        }
      });

      return newPost;
    } catch (err) {
      console.error('Error uploading post:', err);
      throw error(500, 'Failed to upload post');
    }
  }
}
