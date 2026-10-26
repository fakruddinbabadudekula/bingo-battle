export const BOARD_SIZES = [5, 6, 7];

export const BINGO_WORDS = {
  5: 'BINGO',
  6: 'BINGOS',
  7: 'BINGOES',
};

export function createBoard(size, random = Math.random) {
  const board = Array.from({ length: size * size }, (_, index) => index + 1);

  for (let index = board.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [board[index], board[swapIndex]] = [board[swapIndex], board[index]];
  }

  return board;
}

export function createWinningLines(size) {
  const lines = [];

  for (let row = 0; row < size; row += 1) {
    lines.push(Array.from({ length: size }, (_, column) => row * size + column));
  }

  for (let column = 0; column < size; column += 1) {
    lines.push(Array.from({ length: size }, (_, row) => row * size + column));
  }

  lines.push(Array.from({ length: size }, (_, index) => index * size + index));
  lines.push(Array.from({ length: size }, (_, index) => index * size + (size - index - 1)));

  return lines;
}

export function countCompletedLines(board, markedValues, size) {
  if (!board.length) return 0;

  const marked = new Set(markedValues);
  return createWinningLines(size).filter((line) =>
    line.every((cellIndex) => marked.has(board[cellIndex]))
  ).length;
}

export function chooseComputerMove(board, markedValues, size, difficulty, random = Math.random) {
  const marked = new Set(markedValues);
  const available = board.filter((value) => !marked.has(value));

  if (available.length === 0) return null;
  if (difficulty === 'easy') {
    return available[Math.floor(random() * available.length)];
  }

  const lines = createWinningLines(size);
  let bestProgress = -1;
  let bestMoves = [];

  available.forEach((value) => {
    const cellIndex = board.indexOf(value);
    const progress = Math.max(
      0,
      ...lines
        .filter((line) => line.includes(cellIndex))
        .map((line) => line.filter((index) => marked.has(board[index])).length)
    );

    if (progress > bestProgress) {
      bestProgress = progress;
      bestMoves = [value];
    } else if (progress === bestProgress) {
      bestMoves.push(value);
    }
  });

  return bestMoves[Math.floor(random() * bestMoves.length)];
}

export function createInitialGameState() {
  return {
    playerBoard: [],
    computerBoard: [],
    markedValues: [],
    phase: 'setup',
    winner: null,
  };
}

function resolveWinner(playerBoard, computerBoard, markedValues, size, computerJustMoved = false) {
  const playerLines = countCompletedLines(playerBoard, markedValues, size);
  const computerLines = countCompletedLines(computerBoard, markedValues, size);

  if (computerJustMoved) {
    if (computerLines >= size) return 'computer';
    if (playerLines >= size) return 'player';
  } else {
    if (playerLines >= size) return 'player';
    if (computerLines >= size) return 'computer';
  }

  return null;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        playerBoard: action.playerBoard,
        computerBoard: action.computerBoard,
        markedValues: [],
        phase: 'player-turn',
        winner: null,
      };

    case 'PLAYER_MOVE': {
      if (state.phase !== 'player-turn' || state.winner) return state;

      const value = state.playerBoard[action.cellIndex];
      if (value == null || state.markedValues.includes(value)) return state;

      const markedValues = [...state.markedValues, value];
      const winner = resolveWinner(
        state.playerBoard,
        state.computerBoard,
        markedValues,
        action.size
      );

      return {
        ...state,
        markedValues,
        winner,
        phase: winner ? 'finished' : 'computer-turn',
      };
    }

    case 'COMPUTER_MOVE': {
      if (state.phase !== 'computer-turn' || state.winner) return state;
      if (action.value == null || state.markedValues.includes(action.value)) return state;

      const markedValues = [...state.markedValues, action.value];
      const winner = resolveWinner(
        state.playerBoard,
        state.computerBoard,
        markedValues,
        action.size,
        true
      );

      return {
        ...state,
        markedValues,
        winner,
        phase: winner ? 'finished' : 'player-turn',
      };
    }

    default:
      return state;
  }
}
