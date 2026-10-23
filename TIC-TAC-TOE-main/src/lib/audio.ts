export const playTone = (frequency: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log("Audio not supported or blocked", e);
  }
};

export const playMoveSound = (player: 'X' | 'O') => {
  if (player === 'X') playTone(440, 'sine', 0.15);
  else playTone(554.37, 'sine', 0.15); // C#
};

export const playWinSound = () => {
  setTimeout(() => playTone(440, 'square', 0.1, 0.05), 0);
  setTimeout(() => playTone(554.37, 'square', 0.1, 0.05), 100);
  setTimeout(() => playTone(659.25, 'square', 0.2, 0.05), 200);
};

export const playLoseSound = () => {
  setTimeout(() => playTone(300, 'sawtooth', 0.2, 0.05), 0);
  setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.05), 200);
};

export const playDrawSound = () => {
  playTone(200, 'sine', 0.3, 0.05);
};
