import React, { useState } from 'react';
import { generateSchedule } from '../services/huggingfaceService';

const ScheduleGenerator: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateSchedule(goal, startDate, endDate, intensity);
    setSchedule(result);
    setLoading(false);
  };

  return (
    <div>
      <h2>Generate AI Schedule</h2>
      <input
        type="text"
        placeholder="Your goal"
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      <select value={intensity} onChange={e => setIntensity(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Schedule'}
      </button>
      <div>
        <h3>Schedule:</h3>
        <pre>{schedule}</pre>
      </div>
    </div>
  );
};

export default ScheduleGenerator;