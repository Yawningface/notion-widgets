import React, { useState, useEffect } from 'react';

const PomodoroComponent = () => {
  const timerTypes = {
    Pomodoro: 25 * 60,
    'Short Break': 5 * 60,
    'Long Break': 15 * 60,
  };

  const [timerType, setTimerType] = useState('Pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(timerTypes[timerType]);
  const [isActive, setIsActive] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);

  // Disable scrollbar globally
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(timerTypes[timerType]);
    setIsActive(false);
  }, [timerType]);

  useEffect(() => {
    let intervalId = null;
    if (isActive && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      handleTimerEnd();
      setIsActive(false);
    }
    return () => clearInterval(intervalId);
  }, [isActive, secondsLeft]);

  const getNextMode = (currentMode) => {
    if (currentMode === 'Pomodoro') return 'Short Break';
    if (currentMode === 'Short Break') return 'Pomodoro';
    if (currentMode === 'Long Break') return 'Pomodoro';
    return 'Pomodoro';
  };

  const handleTimerEnd = () => {
    const audio = new Audio('https://boringtube.blob.core.windows.net/public/pomodoro_bell.wav');
    audio.play().catch((error) => console.error('Failed to play sound:', error));

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Time's up! ${timerType} finished.`);
    }

    if (autoSwitch) {
      const nextMode = getNextMode(timerType);
      setTimerType(nextMode);
      setIsActive(true);
    }
  };

  const handleTimerTypeChange = (type) => {
    setTimerType(type);
  };

  const handleStartStopClick = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setSecondsLeft(timerTypes[timerType]);
    setIsActive(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage =
    ((timerTypes[timerType] - secondsLeft) / timerTypes[timerType]) * 100;

  return (
    <div
      className="flex items-start justify-center h-screen bg-gray-900"
      style={{
        overflow: 'hidden',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      <div
        className="relative inline-block p-1 rounded-[20px] mt-10"
        style={{
          background: `conic-gradient(#ebb305 ${progressPercentage}%, #4B5563 0)`,
        }}
      >
        <div className="bg-[#1F2937] text-[#e5e7eb] rounded-[20px] p-5 flex flex-col items-center gap-4 w-full max-w-[400px]">
          <div className="flex gap-2 w-full justify-center">
            {Object.keys(timerTypes).map((type) => (
              <button
                key={type}
                onClick={() => handleTimerTypeChange(type)}
                className={`text-sm px-3 py-1 rounded-md transition ${
                  timerType === type
                    ? 'bg-[#ebb305] text-[#101827]'
                    : 'border border-[#9ca3af] text-[#e5e7eb]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSwitch"
              checked={autoSwitch}
              onChange={() => setAutoSwitch((prev) => !prev)}
              className="form-checkbox h-4 w-4 text-[#ebb305]"
            />
            <label htmlFor="autoSwitch" className="text-sm text-[#e5e7eb]">
              Auto Switch Mode
            </label>
          </div>

          <div className="w-full text-center">
            <div className="text-6xl font-bold text-[#e5e7eb]">
              {formatTime()}
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleStartStopClick}
              disabled={secondsLeft <= 0}
              className="flex-1 py-3 bg-[#ebb305] text-[#101827] font-bold uppercase rounded-md shadow transition disabled:opacity-50"
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-[#ebb305] text-[#101827] font-bold uppercase rounded-md shadow transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroComponent;
