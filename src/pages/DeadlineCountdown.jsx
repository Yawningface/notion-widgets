import React, { useState, useEffect } from 'react';

// Utility to parse URL params
const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    utc: searchParams.get('utc'), // UTC Timestamp
    task: searchParams.get('task') || 'My Deadline',
  };
};

const DeadlineCountdownComponent = () => {
  const params = getParams();
  const initialDueDate = params.utc ? new Date(params.utc) : null;

  const [dueDate, setDueDate] = useState(initialDueDate);
  const [timeLeft, setTimeLeft] = useState(dueDate ? getTimeLeft(initialDueDate) : {});
  const [isConfiguring, setIsConfiguring] = useState(!initialDueDate);
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [taskName, setTaskName] = useState(params.task);
  const [showTimezone, setShowTimezone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (dueDate) {
      const timer = setInterval(() => {
        setTimeLeft(getTimeLeft(dueDate));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [dueDate]);

  function getTimeLeft(dueDate) {
    const now = new Date();
    const difference = dueDate - now;

    return {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const handleSave = () => {
    const combinedDateTime = new Date(`${inputDate}T${inputTime}`);
    if (isNaN(combinedDateTime.getTime())) {
      alert('Please enter a valid date and time.');
      return;
    }
    const utcString = combinedDateTime.toISOString();
    setDueDate(new Date(utcString));
    setIsConfiguring(false);

    // Generate the embed link with UTC time
    const currentUrl = window.location.href.split('?')[0];
    const embedLink = `${currentUrl}?utc=${encodeURIComponent(utcString)}&task=${encodeURIComponent(taskName)}`;
    prompt('Copy this link to embed in Notion:', embedLink);
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div
      className="flex items-start justify-center h-screen bg-gray-900 px-4"
      style={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div
        className="relative inline-block p-1 rounded-[20px] mt-10"
        style={{
          background: `#4B5563`, // Static grey background
          padding: '4px',
          borderRadius: '20px',
        }}
      >
        <div className="bg-[#1F2937] text-[#e5e7eb] rounded-[20px] p-5 flex flex-col items-center gap-4 w-full max-w-[600px] px-8">
          <h1 className="text-3xl font-bold text-[#ebb305]">
            {taskName || 'Deadline Countdown'}
          </h1>

          {isConfiguring ? (
            <div className="flex flex-col gap-3 w-full">
              <input
                type="text"
                placeholder="Task Name (optional)"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#374151] text-white placeholder-gray-400"
              />
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#374151] text-white"
              />
              <input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#374151] text-white"
              />
              <button
                onClick={handleSave}
                className="py-2 bg-[#ebb305] text-[#101827] font-bold uppercase rounded-md shadow transition"
              >
                Generate Embed Link
              </button>
            </div>
          ) : (
            <>
              {timeLeft.total > 0 ? (
                <div className="text-center text-5xl font-bold text-[#e5e7eb]">
                  {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
                </div>
              ) : (
                <div className="text-4xl font-bold text-red-500">Deadline Passed!</div>
              )}

              <p
                className="text-sm text-[#9ca3af] relative cursor-pointer"
                onMouseEnter={() => setShowTimezone(true)}
                onMouseLeave={() => setShowTimezone(false)}
              >
                Due on:{' '}
                {dueDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at{' '}
                <span className="underline text-[#ebb305]">
                  {dueDate.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                {/* Tooltip */}
                {showTimezone && (
                  <span className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[#374151] text-white text-xs px-2 py-1 rounded-md shadow-md">
                    Your Timezone: {userTimezone}
                  </span>
                )}
              </p>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsConfiguring(true);
                }}
                className="text-[#ebb305] text-sm underline hover:text-yellow-400 transition"
              >
                Edit Deadline
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineCountdownComponent;
