export class BoardService {
  private static readonly boardMap: Record<string, string> = {
    1: 'void',
    2: 'seams',
    3: 'adventures'
  };

  static getBoardName(id: number): string {
    return this.boardMap[id] ?? 'Unknown Board';
  }

  // TODO: Format response (make posts_new[] turn into thread[] sorted by latest activity)
}
