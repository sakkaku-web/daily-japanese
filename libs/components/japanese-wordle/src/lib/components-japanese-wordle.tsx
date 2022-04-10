import './components-japanese-wordle.module.scss';
import './index.css';
import { AlertProvider } from './context/AlertContext';
import { Game } from './game-components/Game';

export interface Props {
  word: string;
  maxAttempts: number;
  hardMode?: boolean;
  darkMode?: boolean;
  onWin?: () => void;
  onLose?: () => void;
}

export function JapaneseWordle(props: Props) {
  return (
    <AlertProvider>
      <Game {...props} />
    </AlertProvider>
  );
}

export default JapaneseWordle;
