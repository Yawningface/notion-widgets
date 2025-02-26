import React from 'react';
import { Link } from 'react-router-dom';
import AdComponent from '../components/AdComponent';

function Home() {
  return (
    <div className="flex flex-col items-center gap-10">
      <nav className="text-center mb-8">
        <Link to="/" className="text-4xl font-bold text-white hover:text-[#ebb305] transition">
          Notion Widgets by YawningFace
        </Link>
      </nav>
      <h2 className="text-xl text-[#9ca3af]">Simple, Minimal, Notion-Ready Components</h2>

      <div className="flex flex-wrap gap-6 justify-center mt-4">
        <AdComponent 
          image="/pomodoro.jpg"
          title="Pomodoro"
          description="Stay focused with the Pomodoro technique."
          link="/pomodoro"
        />
        
        <AdComponent 
          image="/day_of_year.jpg"
          title="Day counter"
          description="See what day of the year it is today."
          link="/day-of-year"
        />
        <AdComponent 
          image="/chronometer.jpg"
          title="Chronometer"
          description="A simple chronometer"
          link="/chronometer"
        />
        <AdComponent 
          image="/deadline_countdown.jpg"
          title="Deadline Countdown"
          description="Know how much time is left for your deadline."
          link="/deadline-countdown"
        />
        <AdComponent 
          image="/lofi.jpg"
          title="Lofi music player"
          description="Play some lofi music while you work."
          link="/lofi"
        />
        
        
      </div>

      <footer className="text-sm text-[#9ca3af] mt-10">
        Made with ❤️ by YawningFace • <a href="https://yawningface.org" className="text-[#ebb305] hover:underline">Visit Main Site</a>
      </footer>
    </div>
  );
}

export default Home;
