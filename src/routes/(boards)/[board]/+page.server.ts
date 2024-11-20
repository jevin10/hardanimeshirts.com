import { error } from "@sveltejs/kit";

const validBoards = ['void', 'seams', 'adventures'] as const;

type ValidBoard = typeof validBoards[number];

const boardIdMap = {
  'void': 1,
  'seams': 2,
  'adventures': 3
} as const;

export async function load({ params, locals }) {
  if (!validBoards.includes(params.board as ValidBoard)) {
    throw error(404, 'Board not found');
  }

  const boardId = boardIdMap[params.board as ValidBoard];

  return {
    boardId
  }
}
