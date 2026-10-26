import { useState } from 'react';
import Bingo from './Components/Bingo';
import Navbar from './Components/Navbar';
import './App.css';

function App() {
  const [boardSize, setBoardSize] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const [clickSoundEnabled, setClickSoundEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  return (
    <div className="app-shell">
      <Navbar
        boardSize={boardSize}
        onBoardSizeChange={setBoardSize}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        clickSoundEnabled={clickSoundEnabled}
        onClickSoundChange={setClickSoundEnabled}
        musicEnabled={musicEnabled}
        onMusicChange={setMusicEnabled}
      />
      <main>
        <Bingo
          key={boardSize + '-' + difficulty}
          boardSize={boardSize}
          difficulty={difficulty}
          clickSoundEnabled={clickSoundEnabled}
        />
      </main>
      <footer className="site-footer">
        <p>Bingo Battle - A game of strategy, pattern spotting, and a little luck.</p>
      </footer>
    </div>
  );
}

export default App;
