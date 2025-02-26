import React, { useEffect } from 'react';

const DayOfYearComponent = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const isLeapYear = (year) =>
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const totalDaysInYear = isLeapYear(today.getFullYear()) ? 366 : 365;
  const yearProgress = (dayOfYear / totalDaysInYear) * 100;

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Disable scrollbar globally
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="flex items-start justify-center h-screen bg-gray-900"
      style={{
        overflow: 'hidden',
        scrollbarWidth: 'none', // For Firefox
        msOverflowStyle: 'none', // For IE/Edge
      }}
    >
      <div
        className="relative inline-block p-1 rounded-[20px] mt-10"
        style={{
          background: `conic-gradient(#ebb305 ${yearProgress}%, #4B5563 0)`,
        }}
      >
        <div className="bg-[#1F2937] text-[#e5e7eb] rounded-[20px] p-5 flex flex-col items-center gap-4 w-full max-w-[400px]">
          <h1 className="text-3xl font-bold text-[#ebb305]">Day of the Year</h1>

          {/* Day with total days */}
          <div className="flex items-baseline gap-1">
            <div className="text-6xl font-bold">{dayOfYear}</div>
            <div className="text-sm text-[#9ca3af]">/ {totalDaysInYear}</div>
          </div>

          <p className="text-sm text-[#9ca3af]">{formattedDate}</p>

          <p className="text-sm text-[#9ca3af]">
            {yearProgress.toFixed(2)}% of {today.getFullYear()} completed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DayOfYearComponent;
