import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Pomodoro from './pages/Pomodoro';
import DayOfYear from './pages/DayOfYear';
import Chronometer from "./pages/Chronometer";
import LofiPlayerComponent from "./pages/Lofi";

import DeadlineCountdownComponent from './pages/DeadlineCountdown';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#101827] p-6">
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/deadline-countdown" element={<DeadlineCountdownComponent />} />
        <Route path="/day-of-year" element={<DayOfYear />} />
        <Route path="/chronometer" element={<Chronometer />} />
        <Route path="/lofi" element={<LofiPlayerComponent />} />

      </Routes>
    </div>
  );
}

export default App;
