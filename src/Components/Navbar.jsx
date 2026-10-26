import { useEffect, useRef, useState } from 'react';
import Song from '../Audio/BackgroundMusic.mp3';

function Navbar({
  boardSize,
  onBoardSizeChange,
  difficulty,
  onDifficultyChange,
  clickSoundEnabled,
  onClickSoundChange,
  musicEnabled,
  onMusicChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const musicRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(Song);
    audio.loop = true;
    audio.volume = 0.18;
    musicRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      musicRef.current = null;
    };
  }, []);

  const toggleMusic = (event) => {
    const shouldPlay = event.target.checked;
    const audio = musicRef.current;

    if (!audio) return;

    if (shouldPlay) {
      audio.play()
        .then(() => onMusicChange(true))
        .catch(() => onMusicChange(false));
    } else {
      audio.pause();
      audio.currentTime = 0;
      onMusicChange(false);
    }
  };

  return (
    <header className="site-header">
      <nav className="navigation" aria-label="Game settings">
        <a className="brand" href="./" aria-label="Bingo Battle home">Bingo<span>Battle</span></a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="game-settings"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close menu' : 'Settings'}
        </button>

        <div id="game-settings" className={menuOpen ? 'settings is-open' : 'settings'}>
          <label className="select-control">
            <span>Board size</span>
            <select
              value={boardSize}
              onChange={(event) => onBoardSizeChange(Number(event.target.value))}
            >
              <option value={5}>5 × 5</option>
              <option value={6}>6 × 6</option>
              <option value={7}>7 × 7</option>
            </select>
          </label>

          <label className="select-control">
            <span>Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) => onDifficultyChange(event.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label className="check-control">
            <input
              type="checkbox"
              checked={clickSoundEnabled}
              onChange={(event) => onClickSoundChange(event.target.checked)}
            />
            <span>Click sound</span>
          </label>

          <label className="check-control">
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={toggleMusic}
            />
            <span>Music</span>
          </label>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

