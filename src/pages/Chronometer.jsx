import React, { useState, useEffect } from 'react';

const ChronometerComponent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);

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
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prev) => [...prev, elapsedTime]);
    }
  };

  const progressPercentage = (elapsedTime % 60) * (100 / 60); // Represents seconds progress

  return (
    <div
      className="flex items-start justify-center h-screen bg-gray-900 px-4"
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
        <div className="bg-[#1F2937] text-[#e5e7eb] rounded-[20px] p-5 flex flex-col items-center gap-4 w-full max-w-[600px] px-10">
          <h1 className="text-3xl font-bold text-[#ebb305]">Chronometer</h1>

          <div className="text-6xl font-bold text-[#e5e7eb]">
            {formatTime(elapsedTime)}
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleStartStop}
              className="flex-1 py-0.5 bg-[#ebb305] text-[#101827] font-bold uppercase rounded-md shadow transition"
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>

            <button
              onClick={handleReset}
              disabled={elapsedTime === 0}
              className={`flex-1 py-0.5 bg-[#ebb305] text-[#101827] font-bold uppercase rounded-md shadow transition ${
                elapsedTime === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Reset
            </button>

            <button
              onClick={handleLap}
              disabled={!isRunning}
              className="flex-1 py-0.5 bg-[#ebb305] text-[#101827] font-bold uppercase rounded-md shadow transition disabled:opacity-50"
            >
              Lap
            </button>
          </div>

          {laps.length > 0 && (
            <div className="w-full max-h-40 overflow-auto mt-4 text-sm text-[#e5e7eb]">
              <h2 className="text-center text-[#ebb305] font-semibold mb-2">
                Laps
              </h2>
              <ul className="space-y-1">
                {laps.map((lap, index) => (
                  <li
                    key={index}
                    className="flex justify-between px-4 py-2 bg-[#374151] rounded-md"
                  >
                    <span>Lap {index + 1}</span>
                    <span>{formatTime(lap)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChronometerComponent;
