import { ImageboardRepositoryImpl } from "./repository/ImageboardRepositoryImpl";
import type ImageboardRepository from "./repository/ImageboardRepository";
import type { posts_new } from "@prisma/client";

export class ImageboardService {
  private static instance: ImageboardService;
  private repository: ImageboardRepository;

  private constructor(repository: ImageboardRepository) {
    this.repository = repository;
  }

  // Gets or creates the singleton instance of ImageboardService
  public static getInstance(): ImageboardService {
    if (!ImageboardService.instance) {
      // Create singleton instance with repository dependency
      const repository = new ImageboardRepositoryImpl();
      ImageboardService.instance = new ImageboardService(repository);
    }
    return ImageboardService.instance;
  }

  /**
   * Gets content from the imageboard based on provided parameters
   * Delegates to repository layer for data access
   */
  async getContent(boardId: number | null, page: number, limit: number, threadId?: number): Promise<posts_new[]> {
    return await this.repository.getContent(boardId, page, limit, threadId);
  }
}

// Export singleton instance
export const imageboardService = ImageboardService.getInstance();
