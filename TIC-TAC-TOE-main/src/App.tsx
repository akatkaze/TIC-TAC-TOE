import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameMode, Difficulty, calculateWinner, isBoardFull, getAIMove } from './lib/gameLogic';
import { playMoveSound, playWinSound, playLoseSound, playDrawSound } from './lib/audio';

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('AI');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [timeLeft, setTimeLeft] = useState(15);
  const [stats, setStats] = useState({ xWins: 0, oWins: 0, draws: 0 });
  const [isClient, setIsClient] = useState(false);
  const [playerXName, setPlayerXName] = useState('Player 1');
  const [playerOName, setPlayerOName] = useState('AI');

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (gameMode === 'AI') {
      setPlayerOName('AI');
    } else {
      if (playerOName === 'AI' || playerOName === 'Player O') {
        setPlayerOName('Player 2');
      }
    }
  }, [gameMode]);


  const { winner, line: winningLine } = calculateWinner(board);
  const isDraw = !winner && isBoardFull(board);
  const isGameOver = !!winner || isDraw;

  // Assuming Player 1 is always X and Player 2/AI is O.
  const isAITurn = gameMode === 'AI' && !xIsNext && !isGameOver;

  // Timer Effect
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [xIsNext, isGameOver]);

  // Handle timeout auto-play
  useEffect(() => {
    if (timeLeft === 0 && !isGameOver && !isAITurn) {
       // Human ran out of time, play a random move for them
       const availableMoves = board.map((m, i) => m === null ? i : -1).filter(i => i !== -1);
       if (availableMoves.length > 0) {
           const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
           handlePlay(randomMove, xIsNext ? 'X' : 'O');
       }
    }
  }, [timeLeft, isGameOver, isAITurn]);

  // UI Sound Effects and Stats update
  useEffect(() => {
    if (winner) {
      if (gameMode === 'AI' && winner === 'O') {
         playLoseSound();
      } else {
         playWinSound();
      }
      setStats(prev => ({
        ...prev,
        xWins: winner === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: winner === 'O' ? prev.oWins + 1 : prev.oWins,
      }));
    } else if (isDraw) {
      playDrawSound();
      setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [winner, isDraw, gameMode]);

  // AI Turn handler
  useEffect(() => {
    if (isAITurn && timeLeft > 0) {
      // Small delay to make the AI feel natural
      const timer = setTimeout(() => {
        const move = getAIMove(board, difficulty, 'O');
        if (move !== -1) {
          handlePlay(move, 'O');
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAITurn, board, difficulty, timeLeft]);

  const handlePlay = (index: number, player: Player) => {
    if (board[index] || winner || (isAITurn && player === 'X')) return;

    playMoveSound(player);
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setXIsNext(player === 'O');
    setTimeLeft(15); // Reset timer for next player
  };

  const handleSquareClick = (index: number) => {
    if (isAITurn) return; // Prevent human from clicking during AI turn
    handlePlay(index, xIsNext ? 'X' : 'O');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setTimeLeft(15);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';
  
  // Dynamic Theme Classes
  const bgRoot = isDark ? 'bg-[#050508] text-slate-200' : 'bg-gradient-to-br from-emerald-100 via-teal-100 to-green-200 text-emerald-950';
  const navBg = isDark ? 'backdrop-blur-md bg-black/20 border-white/10' : 'bg-white/60 border-white/80 shadow-sm backdrop-blur-md';
  const glassBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-emerald-300 shadow-[0_8px_32px_rgba(16,185,129,0.15)] backdrop-blur-xl';
  const mutedText = isDark ? 'text-slate-400 opacity-50' : 'text-emerald-800/80 font-bold';
  const textColor = isDark ? 'text-white' : 'text-emerald-950';
  const btnActive = isDark ? 'bg-cyan-500/20 border-cyan-500/50 ring-1 ring-cyan-500/20 text-cyan-400' : 'bg-white border-emerald-400 ring-2 ring-emerald-400 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
  const btnInactive = isDark ? 'bg-white/5 border-white/10 opacity-50 hover:opacity-100' : 'bg-white/50 border-emerald-300 text-emerald-800 hover:bg-white/80';

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className={`min-h-screen font-sans overflow-hidden flex flex-col relative w-full transition-colors duration-500 ${bgRoot}`}>
      
      {/* Animated Tactical Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden fixed">
        <motion.div 
           animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className={`absolute inset-[-50%] w-[200%] h-[200%] bg-[length:40px_40px] opacity-70 ${
            isDark 
              ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(rgba(16,185,129,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.15)_1px,transparent_1px)]'
           }`}
           style={{ maskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)' }}
        />
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none fixed z-0">
        <motion.div 
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 50, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full blur-[100px] md:blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-blue-900/40' : 'bg-emerald-400/50'}`}
        />
        <motion.div 
          animate={{ x: [0, -80, 50, 0], y: [0, 70, -40, 0], scale: [1, 1.1, 1.3, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full blur-[100px] md:blur-[120px] transition-colors duration-1000 ${isDark ? 'bg-purple-900/40' : 'bg-teal-400/50'}`}
        />
      </div>

      <nav className={`h-16 border-b shrink-0 flex items-center justify-between px-4 md:px-8 z-10 transition-colors duration-500 ${navBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <span className="font-black text-white italic text-xs">G</span>
          </div>
          <span className="font-bold tracking-widest text-[10px] md:text-sm uppercase whitespace-nowrap">
            Neon Tactics <span className="hidden sm:inline text-cyan-500 font-mono text-[10px] ml-2">v2.0.0</span>
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-[10px] font-bold tracking-[0.2em] uppercase">
          <span className="text-cyan-500 border-b border-cyan-500 pb-1 whitespace-nowrap">Arena</span>
          <button onClick={toggleTheme} className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2 cursor-pointer p-2 rounded-full hover:bg-slate-500/10">
            {isDark ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 lg:p-8 z-10 items-center justify-center w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 lg:gap-8 w-full max-w-full">
          
          {/* Left Sidebar - Game Config & Timer */}
          <div className="w-full sm:w-[280px] md:w-48 lg:w-64 flex flex-col gap-4 lg:gap-6 shrink-0 md:order-1 order-2">
          
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${glassBg}`}>
            <h3 className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-4">Turn Timer</h3>
            <div className="flex flex-col items-center justify-center py-4 relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className={isDark ? 'text-white/5' : 'text-black/5'} />
                    <motion.circle 
                      cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent"
                      className={timeLeft <= 5 ? 'text-red-500' : 'text-cyan-400'}
                      strokeDasharray="276"
                      animate={{ strokeDashoffset: 276 - (timeLeft / 15) * 276 }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                 </svg>
              </div>
              <span className={`text-4xl font-black font-mono transition-colors ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : textColor}`}>
                {timeLeft}s
              </span>
            </div>
            <div className={`text-[9px] uppercase tracking-widest text-center mt-2 ${mutedText}`}>Remaining</div>
          </div>

          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-colors duration-500 ${glassBg}`}>
            <h3 className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-4">Configuration</h3>
            <div className="space-y-6">
              
              {/* Player Names */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className={`text-[9px] uppercase tracking-tighter mb-1 block ${mutedText}`}>Player X Name</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={playerXName}
                    onChange={(e) => setPlayerXName(e.target.value)}
                    placeholder="Player X"
                    className={`w-full bg-transparent border-b outline-none text-[10px] font-bold pb-1 transition-colors ${isDark ? 'border-white/20 focus:border-cyan-400 text-white' : 'border-emerald-200 focus:border-cyan-500 text-emerald-950'}`}
                  />
                </div>
                
                {gameMode === '2P' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <label className={`text-[9px] uppercase tracking-tighter mb-1 block pt-1 ${mutedText}`}>Player O Name</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={playerOName}
                      onChange={(e) => setPlayerOName(e.target.value)}
                      placeholder="Player O"
                      className={`w-full bg-transparent border-b outline-none text-[10px] font-bold pb-1 transition-colors ${isDark ? 'border-white/20 focus:border-purple-400 text-white' : 'border-emerald-200 focus:border-purple-500 text-emerald-950'}`}
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label className={`text-[9px] uppercase tracking-tighter mb-2 block ${mutedText}`}>Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setGameMode('AI'); resetGame(); }}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${gameMode === 'AI' ? btnActive : btnInactive}`}
                  >
                    AI Match
                  </button>
                  <button 
                    onClick={() => { setGameMode('2P'); resetGame(); }}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${gameMode === '2P' ? btnActive : btnInactive}`}
                  >
                    2 Players
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {gameMode === 'AI' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-2">
                      <label className={`text-[9px] uppercase tracking-tighter mb-2 block ${mutedText}`}>Difficulty</label>
                      <div className="flex flex-col gap-2">
                        {/* EASY */}
                        <div 
                          onClick={() => { setDifficulty('EASY'); resetGame(); }}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                            difficulty === 'EASY' 
                              ? (isDark ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20 text-green-400' : 'bg-green-100 border-green-400 ring-2 ring-green-400 text-green-700')
                              : (isDark ? 'bg-white/5 border border-white/5 hover:bg-white/10 opacity-70' : 'bg-white/50 border border-emerald-300 hover:bg-white/80 text-emerald-800')
                          }`}
                        >
                          <span className="text-[10px] font-bold">LEVEL 1 <span className={`ml-2 font-normal ${isDark ? 'opacity-60' : 'opacity-80'}`}>Novice</span></span>
                          <div className={`w-2 h-2 rounded-full ${difficulty === 'EASY' ? 'bg-green-400 shadow-[0_0_8px_green]' : 'bg-green-500/40'}`}></div>
                        </div>
                        {/* MEDIUM */}
                        <div 
                          onClick={() => { setDifficulty('MEDIUM'); resetGame(); }}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                            difficulty === 'MEDIUM' 
                              ? (isDark ? 'bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20 text-cyan-400' : 'bg-cyan-100 border-cyan-400 ring-2 ring-cyan-400 text-cyan-700')
                              : (isDark ? 'bg-white/5 border border-white/5 hover:bg-white/10 opacity-70' : 'bg-white/50 border border-emerald-300 hover:bg-white/80 text-emerald-800')
                          }`}
                        >
                          <span className="text-[10px] font-bold">LEVEL 2 <span className={`ml-2 font-normal ${isDark ? 'opacity-60' : 'opacity-80'}`}>Adept</span></span>
                          <div className={`w-2 h-2 rounded-full ${difficulty === 'MEDIUM' ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-cyan-500/40'}`}></div>
                        </div>
                        {/* HARD */}
                        <div 
                          onClick={() => { setDifficulty('HARD'); resetGame(); }}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                            difficulty === 'HARD' 
                              ? (isDark ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/20 text-purple-400' : 'bg-purple-100 border-purple-400 ring-2 ring-purple-400 text-purple-700')
                              : (isDark ? 'bg-white/5 border border-white/5 hover:bg-white/10 opacity-70' : 'bg-white/50 border border-emerald-300 hover:bg-white/80 text-emerald-800')
                          }`}
                        >
                          <span className="text-[10px] font-bold">LEVEL 3 <span className={`ml-2 font-normal ${isDark ? 'opacity-60' : 'opacity-80'}`}>Master</span></span>
                          <div className={`w-2 h-2 rounded-full ${difficulty === 'HARD' ? (isDark ? 'bg-purple-500 shadow-[0_0_8px_purple]' : 'bg-purple-600 shadow-[0_0_8px_purple]') : 'bg-purple-500/40'}`}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Central Game Area */}
        <div className="flex-1 flex flex-col items-center justify-start relative w-full shrink-0 md:order-2 order-1 md:min-w-[280px] max-w-lg mb-6 md:mb-0">
          
          {/* Winner Full Screen Flash Animation */}
          <AnimatePresence>
            {winner && (
               <motion.div 
                 initial={{ opacity: 1, scale: 1 }}
                 animate={{ opacity: 0, scale: 1.5 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center mix-blend-screen"
               >
                 <div className={`w-screen h-screen ${winner === 'X' ? 'bg-cyan-400/20' : 'bg-purple-400/20'}`} />
               </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8 w-full flex flex-col items-center gap-4 min-h-[140px]">
            {!isGameOver && (
               <AnimatePresence mode="wait">
                 <motion.div key={xIsNext ? 'X' : 'O'} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex flex-col items-center gap-2">
                    <div className={`text-[10px] uppercase tracking-[0.4em] mb-1 ${mutedText}`}>Turn Sequence</div>
                    <div className="flex justify-center items-center gap-6 mb-4">
                      <div className={`flex flex-col items-center transition-all ${xIsNext ? 'text-cyan-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-110' : 'text-cyan-500/30'}`}>
                        <span className="text-3xl font-black leading-none">X</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-80 max-w-[80px] truncate">{playerXName || 'Player 1'}</span>
                      </div>
                      <div className={`w-8 h-[2px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                      <div className={`flex flex-col items-center transition-all ${!xIsNext ? 'text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-110' : 'text-purple-500/30'}`}>
                        <span className="text-3xl font-black leading-none">O</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-80 max-w-[80px] truncate">{playerOName || (gameMode === 'AI' ? 'AI' : 'Player 2')}</span>
                      </div>
                    </div>
                    <button 
                      onClick={resetGame}
                      className={`px-6 py-2 rounded-xl border border-dashed font-bold uppercase text-[9px] tracking-widest active:scale-95 transition-all ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'}`}
                    >
                      ABORT MATCH
                    </button>
                 </motion.div>
               </AnimatePresence>
            )}
            
            {isGameOver && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
                <div className={`text-[10px] uppercase tracking-[0.4em] ${mutedText}`}>Match Result</div>
                {winner ? (
                  <motion.div 
                    initial={{ scale: 0.5, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`px-10 py-4 rounded-full border backdrop-blur-md shadow-2xl z-20 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-emerald-200'}`}
                  >
                     <span className={`text-3xl font-black uppercase tracking-widest ${winner === 'X' ? 'text-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,238,1)]' : 'text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,1)]'}`}>
                       {winner === 'X' ? `${playerXName || 'PLAYER X'} WINS` : `${playerOName || (gameMode === 'AI' ? 'AI' : 'PLAYER O')} WINS`}
                     </span>
                  </motion.div>
                ) : (
                  <div className={`px-10 py-3 rounded-full border backdrop-blur-md shadow-2xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-emerald-300'}`}>
                     <span className={`text-3xl font-black uppercase tracking-widest ${textColor}`}>
                       STALEMATE
                     </span>
                  </div>
                )}
                <motion.button 
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: 0.5 } }}
                  onClick={resetGame}
                  className="px-8 py-3 mt-2 rounded-xl bg-cyan-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
                >
                  DEPLOY NEXT ROUND
                </motion.button>
              </motion.div>
            )}
          </div>

          <div className={`grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 rounded-3xl border backdrop-blur-md shadow-2xl relative transition-all duration-500 ${glassBg}`}>
            {board.map((square, index) => {
              const isWinningSquare = winningLine?.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => handleSquareClick(index)}
                  className={`
                    w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${!square && !isGameOver && !isAITurn ? (isDark ? 'hover:bg-white/10 cursor-pointer' : 'hover:bg-emerald-100/60 cursor-pointer') : 'cursor-default'}
                    ${square ? (isDark ? 'bg-white/5 border-white/10 border' : 'bg-emerald-50 border-emerald-400 border-2') : (isDark ? 'bg-white/5 border-white/10 border' : 'bg-white/80 border-emerald-300 border-2')}
                    ${isWinningSquare ? (winner === 'X' ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.8)] z-10 scale-105' : 'bg-purple-500/30 border-purple-400 ring-2 ring-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.8)] z-10 scale-105') : ''}
                  `}
                >
                  <AnimatePresence>
                    {square && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: isWinningSquare ? [0, -10, 10, -10, 0] : 0, y: isWinningSquare ? [0, -15, 0] : 0 }}
                        transition={isWinningSquare ? { duration: 0.5, ease: "easeInOut", repeat: 1 } : { type: "spring", stiffness: 400, damping: 20 }}
                      >
                        {square === 'X' ? (
                          <span className="text-6xl md:text-7xl font-black text-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">X</span>
                        ) : (
                          <span className="text-6xl md:text-7xl font-black text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">O</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {/* Ambient pulse effect over the grid when game is active */}
            {!isGameOver && (
              <div className={`absolute inset-0 pointer-events-none border-2 rounded-3xl animate-pulse ${isDark ? 'border-white/5' : 'border-emerald-500/20'}`}></div>
            )}
          </div>

          <div className="absolute inset-0 pointer-events-none rounded-3xl" />
        </div>

        {/* Right Sidebar - Stats */}
        <div className="w-full sm:w-[280px] md:w-48 lg:w-64 flex flex-col gap-4 lg:gap-6 shrink-0 md:order-3 order-3">
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${glassBg}`}>
            <h3 className="text-[10px] uppercase tracking-widest text-purple-500 font-bold mb-4">Session Stats</h3>
            <div className="space-y-4 font-mono text-[11px] font-bold">
              <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                <span className={`truncate max-w-[140px] pr-2 ${mutedText}`}>{(playerXName || 'PLAYER X').toUpperCase()} (WINS)</span>
                <span className="text-cyan-500 text-base">{stats.xWins}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                <span className={`truncate max-w-[140px] pr-2 ${mutedText}`}>{(playerOName || (gameMode === 'AI' ? 'AI' : 'PLAYER O')).toUpperCase()} (WINS)</span>
                <span className="text-purple-500 text-base">{stats.oWins}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                <span className={mutedText}>STALEMATES</span>
                <span className={textColor}>{stats.draws}</span>
              </div>
            </div>
            {stats.xWins + stats.oWins + stats.draws > 0 && (
               <button onClick={() => setStats({xWins:0, oWins:0, draws:0})} className={`mt-4 w-full text-[9px] uppercase hover:underline ${mutedText}`}>Clear Stats</button>
            )}
          </div>

          <div className={`hidden lg:flex flex-col mt-auto pb-4 transition-colors duration-500`}>
            <span className={`text-[9px] uppercase tracking-widest mb-2 ${mutedText}`}>System Telemetry</span>
            <div className={`font-mono text-[8px] p-3 rounded-lg border space-y-1 opacity-70 ${isDark ? 'bg-black/40 border-white/5 text-slate-500' : 'bg-emerald-100/50 border-emerald-300 text-emerald-800'}`}>
              <div className="flex justify-between"><span>MOVE_COUNT</span><span>{board.filter(s => s).length}</span></div>
              <div className="flex justify-between text-cyan-500/70"><span>AI_DIFF</span><span>{difficulty}</span></div>
              <div className="flex justify-between text-purple-500/70"><span>SYS_THEME</span><span>{theme.toUpperCase()}</span></div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <footer className={`h-10 mt-auto shrink-0 border-t flex items-center justify-between px-4 md:px-8 text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 z-10 w-full transition-colors duration-500 ${isDark ? 'border-white/5 bg-black/40 text-slate-300' : 'border-emerald-300 bg-white/50 text-emerald-800'}`}>
        <span>Project: Tactical Grid</span>
        <span className="hidden sm:inline">© 2024 Kinetic Engine Systems</span>
      </footer>
    </div>
  );
}
