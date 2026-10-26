import { BINGO_WORDS } from '../game/game';

function Table({
  title,
  board,
  boardSize,
  markedValues,
  completedLines,
  interactive,
  onSelect,
  concealNumbers = false
}) {
  const cells = board.length
    ? board
    : Array.from({ length: boardSize * boardSize }, () => null);
  const markedLineCount = Math.min(completedLines, boardSize);
  const bingoWord = BINGO_WORDS[boardSize];

  return (
    <section className={concealNumbers ? 'board-card computer-board' : 'board-card'} aria-label={title}>
      <div className="board-card-heading">
        <h2>{title}</h2>
        <span className="line-count">{completedLines}/{boardSize} lines</span>
      </div>

      <div
        className="bingo-letters"
        aria-label={title + ': ' + completedLines + ' of ' + boardSize + ' lines completed'}
      >
        {bingoWord.split('').map((letter, index) => (
          <span
            className={index < markedLineCount ? 'bingo-letter is-complete' : 'bingo-letter'}
            aria-hidden="true"
            key={letter + index}
          >
            {letter}
          </span>
        ))}
      </div>

      <div
        className="bingo-grid"
        style={{ gridTemplateColumns: 'repeat(' + boardSize + ', minmax(0, 1fr))' }}
        aria-label={title + ' numbers'}
        aria-hidden={concealNumbers}
      >
        {cells.map((value, index) => {
          const isMarked = value != null && markedValues.has(value);
          const row = Math.floor(index / boardSize) + 1;
          const column = (index % boardSize) + 1;
          const label = value == null
            ? 'Row ' + row + ', column ' + column + ', empty'
            : 'Row ' + row + ', column ' + column + ', number ' + value + (isMarked ? ', marked' : '');

          return (
            <button
              key={index}
              type="button"
              className={isMarked ? 'bingo-cell is-marked' : 'bingo-cell'}
              aria-label={label}
              aria-pressed={isMarked}
              disabled={!interactive || value == null || isMarked}
              onClick={() => onSelect && onSelect(index)}
            >
              {isMarked ? <span aria-hidden="true">×</span> : value}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Table;
