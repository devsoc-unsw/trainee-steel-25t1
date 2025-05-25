import React, { useEffect, useState } from 'react';
import { generateSchedule } from '../services/huggingfaceService';

const ScheduleGenerator: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [intensity, setIntensity] = useState('');
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<{ date: string; tasks: string[] }[]>([]);
  const [checked, setChecked] = useState<boolean[][]>([]);

  // Helper to parse schedule string into table data
  const parseScheduleToTable = (scheduleStr: string) => {
    return scheduleStr
      .split(';')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const [date, ...tasks] = line.split('|').map(s => s.trim());
        return { date, tasks };
      })
      .filter(row => row.date && row.tasks.length > 0);
  };

  // Update progress in backend
  const updateProgressInBackend = (progress: number) => {
    const scheduleId = localStorage.getItem('scheduleId');
    if (!scheduleId) return;
    fetch('/api/huggingface/update-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId, overallProgress: progress })
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem('goalData');
    const storedSchedule = localStorage.getItem('scheduleData');
    const storedMeta = localStorage.getItem('scheduleMeta');
    const storedChecked = localStorage.getItem('checkedState');
    const storedScheduleId = localStorage.getItem('scheduleId');
    if (stored) {
      const data = JSON.parse(stored);
      setGoal(data.objective || '');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(data.deadline || '');
      setIntensity(data.dedication || '');

      // Compare meta
      const meta = JSON.stringify({
        objective: data.objective,
        deadline: data.deadline,
        dedication: data.dedication,
      });

      // After loading a schedule from localStorage, check if scheduleId is missing
      if (storedSchedule && storedMeta === meta) {
        setSchedule(storedSchedule);
        const parsed = parseScheduleToTable(storedSchedule);
        setTableData(parsed);
        if (storedChecked) {
          setChecked(JSON.parse(storedChecked));
        } else {
          setChecked(parsed.map(day => day.tasks.map(() => false)));
        }
        // If scheduleId is missing, force user to regenerate
        const storedScheduleId = localStorage.getItem('scheduleId');
        if (!storedScheduleId) {
          alert('Please regenerate your schedule to enable saving progress.');
        }
      } else if (data.objective && data.deadline && data.dedication) {
        setLoading(true);
        generateSchedule(data.objective, new Date().toISOString().split('T')[0], data.deadline, data.dedication)
          .then((result: any) => {
            // result should be { schedule, scheduleId }
            setSchedule(result.schedule || result);
            const parsed = parseScheduleToTable(result.schedule || result);
            setTableData(parsed);
            const initialChecked = parsed.map(day => day.tasks.map(() => false));
            setChecked(initialChecked);
            localStorage.setItem('scheduleData', result.schedule || result); // Save to localStorage
            localStorage.setItem('scheduleMeta', meta);   // Save meta
            localStorage.setItem('checkedState', JSON.stringify(initialChecked));
            if (result.scheduleId) {
              localStorage.setItem('scheduleId', result.scheduleId);
            }
          })
          .finally(() => setLoading(false));
      }
    }
  }, []);

  // Get all unique dates for columns
  const allDates = tableData.map(row => row.date);

  // Find the max number of tasks for any day (for row count)
  const maxTasks = Math.max(...tableData.map(row => row.tasks.length), 0);

  // Handle checkbox change
  const handleCheckboxChange = (dayIdx: number, taskIdx: number) => {
    setChecked(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[dayIdx][taskIdx] = !updated[dayIdx][taskIdx];
      localStorage.setItem('checkedState', JSON.stringify(updated));
      // Calculate progress and update backend
      const totalTasks = tableData.reduce((sum, day) => sum + day.tasks.length, 0);
      const completedTasks = updated.reduce(
        (sum, dayArr) => sum + dayArr.filter(Boolean).length,
        0
      );
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      updateProgressInBackend(progress);
      return updated;
    });
  };

  // Calculate progress
  const totalTasks = tableData.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = checked.reduce(
    (sum, dayArr) => sum + dayArr.filter(Boolean).length,
    0
  );
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '24px', background: '#fafcff', borderRadius: '16px', boxShadow: '0 2px 12px 0 #0001' }}>
      {loading ? (
        <p>Generating your schedule...</p>
      ) : (
        <div>
          <h3><b>Your Goal:</b></h3>
          <p>{goal}</p>
          <h3><b>Start Date:</b></h3>
          <p>{startDate}</p>
          <h3><b>End Date:</b></h3>
          <p>{endDate}</p>
          <h3><b>Intensity:</b></h3>
          <p>{intensity}</p>
          <div style={{ height: '24px' }} />

          <button
            onClick={() => {
              localStorage.removeItem('scheduleData');
              localStorage.removeItem('scheduleMeta');
              localStorage.removeItem('checkedState');
              localStorage.removeItem('scheduleId');
              window.location.reload();
            }}
            style={{
              marginBottom: 24,
              padding: '8px 20px',
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Regenerate Schedule
          </button>

          <h3><b>Schedule Table:</b></h3>
          {tableData.length > 0 ? (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table
                border={1}
                cellPadding={6}
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  minWidth: '800px',
                  border: '2px solid #333',
                  background: '#fff'
                }}
              >
                <thead>
                  <tr>
                    {allDates.map(date => (
                      <th
                        key={date}
                        style={{
                          border: '2px solid #333',
                          background: '#f0f0f0',
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        {date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(maxTasks)].map((_, taskIdx) => (
                    <tr key={taskIdx}>
                      {tableData.map((day, dayIdx) => (
                        <td
                          key={dayIdx}
                          style={{
                            border: '2px solid #333',
                            textAlign: 'left',
                            position: 'relative',
                            padding: '8px 16px'
                          }}
                        >
                          {day.tasks[taskIdx] ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ flex: 1, textAlign: 'left' }}>{day.tasks[taskIdx]}</span>
                              <input
                                type="checkbox"
                                style={{ marginLeft: 16 }}
                                checked={checked[dayIdx]?.[taskIdx] || false}
                                onChange={() => handleCheckboxChange(dayIdx, taskIdx)}
                              />
                            </div>
                          ) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Per-day progress bars */}
                  <tr>
                    {tableData.map((day, dayIdx) => {
                      const dayTotal = day.tasks.length;
                      const dayCompleted =
                        checked[dayIdx]?.filter(Boolean).length || 0;
                      const dayProgress =
                        dayTotal === 0
                          ? 0
                          : Math.round((dayCompleted / dayTotal) * 100);
                      return (
                        <td
                          key={dayIdx}
                          colSpan={1}
                          style={{
                            border: '2px solid #333',
                            background: '#fafafa',
                            padding: '8px 16px'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <div
                              style={{
                                height: '16px',
                                width: '100%',
                                background: '#eee',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #bbb',
                                boxSizing: 'border-box'
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${dayProgress}%`,
                                  background: dayProgress === 100 ? '#4caf50' : '#2196f3',
                                  transition: 'width 0.3s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  fontSize: '12px'
                                }}
                              >
                                {dayProgress}%
                              </div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 2, fontSize: '12px' }}>
                              {dayCompleted} of {dayTotal} done
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
              {/* Overall Progress Bar */}
              <div style={{ marginTop: 32, width: '100%' }}>
                <h4 style={{ marginBottom: 8 }}>Overall Progress</h4>
                <div style={{
                  height: '24px',
                  width: '100%',
                  background: '#eee',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid #333',
                  boxSizing: 'border-box'
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: progress === 100 ? '#4caf50' : '#2196f3',
                      transition: 'width 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                  >
                    {progress}%
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
                  {completedTasks} of {totalTasks} tasks completed
                </div>
                {/* Save Progress Button */}
                <button
                  onClick={() => {
                    const scheduleId = localStorage.getItem('scheduleId');
                    if (!scheduleId) {
                      alert('No schedule ID found.');
                      return;
                    }
                    fetch('/api/huggingface/update-progress', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ scheduleId, overallProgress: progress })
                    })
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) {
                          alert('Progress saved to server!');
                        } else {
                          alert('Failed to save progress.');
                        }
                      })
                      .catch(() => alert('Failed to save progress.'));
                  }}
                  style={{
                    marginTop: 16,
                    padding: '10px 24px',
                    background: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Progress
                </button>
              </div>
            </div>
          ) : (
            <p>No schedule data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleGenerator;