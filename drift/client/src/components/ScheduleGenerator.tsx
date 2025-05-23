import React, { useEffect, useState } from 'react';
import { generateSchedule } from '../services/huggingfaceService';

const ScheduleGenerator: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [intensity, setIntensity] = useState('');
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);

  // On mount, load goal data from localStorage and call AI
  useEffect(() => {
    const stored = localStorage.getItem('goalData');
    if (stored) {
      const data = JSON.parse(stored);
      setGoal(data.objective || '');
      setStartDate(new Date().toISOString().split('T')[0]); // Default to today if not provided
      setEndDate(data.deadline || '');
      setIntensity(data.dedication || '');
      if (data.objective && data.deadline && data.dedication) {
        setLoading(true);
        generateSchedule(data.objective, new Date().toISOString().split('T')[0], data.deadline, data.dedication)
          .then(result => setSchedule(result))
          .finally(() => setLoading(false));
      }
    }
  }, []);

  return (
    <div>
      <h2>AI-Generated Schedule</h2>
      {loading ? (
        <p>Generating your schedule...</p>
      ) : (
        <div>
          <h3>Your Goal:</h3>
          <p>{goal}</p>
          <h3>Schedule:</h3>
          <pre>{schedule}</pre>
        </div>
      )}
    </div>
  );
};

export default ScheduleGenerator;