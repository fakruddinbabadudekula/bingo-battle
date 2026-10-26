import { useCallback, useEffect, useReducer, useRef } from 'react';
import ClickSound from '../Audio/ClickSound.wav';
import Table from './Table';
import {
  BINGO_WORDS,
  chooseComputerMove,
  countCompletedLines,
  createBoard,
  createInitialGameState,
  gameReducer,
} from '../game/game';

function Bingo({ boardSize, difficulty, clickSoundEnabled }) {
  const [game, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const clickAudioRef = useRef(null);
  const markedValues = new Set(game.markedValues);

  useEffect(() => {
    const audio = new Audio(ClickSound);
    audio.volume = 0.35;
    clickAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      clickAudioRef.current = null;
    };
  }, []);

  const playClick = useCallback(() => {
    if (!clickSoundEnabled || !clickAudioRef.current) return;
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch(() => {});
  }, [clickSoundEnabled]);

  useEffect(() => {
    if (game.phase !== 'computer-turn') return undefined;

    const timer = window.setTimeout(() => {
      const value = chooseComputerMove(
        game.computerBoard,
        game.markedValues,
        boardSize,
        difficulty
      );

      if (value != null) {
        playClick();
        dispatch({ type: 'COMPUTER_MOVE', value, size: boardSize });
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [
    game.phase,
    game.computerBoard,
    game.markedValues,
    boardSize,
    difficulty,
    playClick,
  ]);

  const startGame = () => {
    dispatch({
      type: 'START_GAME',
      playerBoard: createBoard(boardSize),
      computerBoard: createBoard(boardSize),
    });
  };

  const selectNumber = (cellIndex) => {
    if (game.phase !== 'player-turn') return;
    playClick();
    dispatch({ type: 'PLAYER_MOVE', cellIndex, size: boardSize });
  };

  const playerLines = countCompletedLines(game.playerBoard, game.markedValues, boardSize);
  const computerLines = countCompletedLines(game.computerBoard, game.markedValues, boardSize);
  const bingoWord = BINGO_WORDS[boardSize];

  let statusText = 'Start a new game to deal your boards.';
  if (game.phase === 'player-turn') statusText = 'Your turn: choose a number from your board.';
  if (game.phase === 'computer-turn') statusText = 'The computer is choosing a number.';
  if (game.winner === 'player') statusText = 'You win! You completed ' + bingoWord + '.';
  if (game.winner === 'computer') statusText = 'The computer wins this round.';

  return (
    <section className="game-page" aria-labelledby="game-title">
      <div className="game-heading">
        <p className="eyebrow">A classic game with a clever opponent</p>
        <h1 id="game-title">Bingo Battle</h1>
        <p className="game-intro">
          Choose a square on your board. The number is marked on both boards, then the computer takes a turn.
          Complete {boardSize} lines to spell {bingoWord} and win.
        </p>
      </div>

      <div className="game-toolbar">
        <p className="game-status" role="status" aria-live="polite">{statusText}</p>
        <button className="primary-button" type="button" onClick={startGame}>
          {game.phase === 'setup' ? 'Start game' : 'New game'}
        </button>
      </div>

      <div className="boards">
        <Table
          title="Your board"
          board={game.playerBoard}
          boardSize={boardSize}
          markedValues={markedValues}
          completedLines={playerLines}
          interactive={game.phase === 'player-turn'}
          onSelect={selectNumber}
        />
        <Table
          title="Computer"
          board={game.computerBoard}
          boardSize={boardSize}
          markedValues={markedValues}
          completedLines={computerLines}
          interactive={false}
          concealNumbers
        />
      </div>

      <p className="game-hint">
        Difficulty: <strong>{difficulty === 'hard' ? 'Hard' : 'Easy'}</strong>
        {' '}· Easy picks randomly; Hard favors numbers that advance a winning line.
      </p>
    </section>
  );
}

export default Bingo;

