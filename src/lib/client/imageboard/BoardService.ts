export class BoardService {
  private static readonly boardMap: Record<string, string> = {
    1: 'void',
    2: 'seams',
    3: 'adventures'
  };

  static getBoardName(id: number): string {
    return this.boardMap[id] ?? 'Unknown Board';
  }

  static getBoardId(name: string): number | null {
    const entries = Object.entries(this.boardMap);
    const match = entries.find(([_, boardName]) => boardName === name);
    return match ? parseInt(match[0]) : null;
  }

  // TODO: Format response (make posts_new[] turn into thread[] sorted by latest activity)
}
