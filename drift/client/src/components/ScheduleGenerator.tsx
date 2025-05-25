import React, { useEffect, useState } from 'react';
import { generateSchedule } from '../services/huggingfaceService';
import DriftLogo from '../assets/drift_logo.svg';

// Beautiful Loading Component
const DriftLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="animate-pulse">
            <img src={DriftLogo} alt="Drift logo" className="h-32 w-32 mx-auto animate-spin-slow" />
          </div>
          {/* Floating particles */}
          <div className="absolute -top-4 -left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-6 w-1 h-1 bg-white rounded-full animate-ping animation-delay-200"></div>
          <div className="absolute -bottom-3 -left-2 w-1.5 h-1.5 bg-white rounded-full animate-ping animation-delay-500"></div>
          <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-white rounded-full animate-ping animation-delay-700"></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white animate-pulse">
            Crafting Your Perfect Schedule
          </h2>
          <p className="text-white/80 text-lg animate-fade-in-up">
            Our AI is analyzing your goals and creating a personalized plan...
          </p>
          
          {/* Loading Bar */}
          <div className="w-80 mx-auto mt-8">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white via-drift-mauve to-white rounded-full animate-loading-bar"></div>
            </div>
          </div>
          
          {/* Loading Steps */}
          <div className="mt-8 space-y-2 text-white/70">
            <div className="flex items-center justify-center space-x-2 animate-fade-in-up animation-delay-1000">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Analyzing your goal complexity...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 animate-fade-in-up animation-delay-2000">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Calculating optimal task distribution...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 animate-fade-in-up animation-delay-3000">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Generating your personalized schedule...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  useEffect(() => {
    const stored = localStorage.getItem('goalData');
    const storedSchedule = localStorage.getItem('scheduleData');
    const storedMeta = localStorage.getItem('scheduleMeta');
    if (stored) {
      const data = JSON.parse(stored);
      setGoal(data.objective || '');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(data.deadline || '');
      setIntensity(data.dedication || '');

      const meta = JSON.stringify({
        objective: data.objective,
        deadline: data.deadline,
        dedication: data.dedication,
      });

      if (storedSchedule && storedMeta === meta) {
        setSchedule(storedSchedule);
        const parsed = parseScheduleToTable(storedSchedule);
        setTableData(parsed);
        setChecked(parsed.map(day => day.tasks.map(() => false)));
      } else if (data.objective && data.deadline && data.dedication) {
        setLoading(true);
        generateSchedule(data.objective, new Date().toISOString().split('T')[0], data.deadline, data.dedication)
          .then(result => {
            setSchedule(result);
            const parsed = parseScheduleToTable(result);
            setTableData(parsed);
            setChecked(parsed.map(day => day.tasks.map(() => false)));
            localStorage.setItem('scheduleData', result);
            localStorage.setItem('scheduleMeta', meta);
          })
          .finally(() => setLoading(false));
      }
    }
  }, []);

  const allDates = tableData.map(row => row.date);
  const maxTasks = Math.max(...tableData.map(row => row.tasks.length), 0);

  const handleCheckboxChange = (dayIdx: number, taskIdx: number) => {
    setChecked(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[dayIdx][taskIdx] = !updated[dayIdx][taskIdx];
      return updated;
    });
  };

  const totalTasks = tableData.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = checked.reduce(
    (sum, dayArr) => sum + dayArr.filter(Boolean).length,
    0
  );
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  if (loading) {
    return <DriftLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <img src={DriftLogo} alt="Drift logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Your Personalized Schedule</h1>
          <p className="text-white/80 text-lg">AI-crafted plan to achieve your goals</p>
        </div>

        {/* Goal Summary Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-white/70 text-sm font-medium mb-2">Your Goal</h3>
              <p className="text-white font-semibold">{goal}</p>
            </div>
            <div className="text-center">
              <h3 className="text-white/70 text-sm font-medium mb-2">Start Date</h3>
              <p className="text-white font-semibold">{startDate}</p>
            </div>
            <div className="text-center">
              <h3 className="text-white/70 text-sm font-medium mb-2">Target Date</h3>
              <p className="text-white font-semibold">{endDate}</p>
            </div>
            <div className="text-center">
              <h3 className="text-white/70 text-sm font-medium mb-2">Dedication Level</h3>
              <p className="text-white font-semibold capitalize">{intensity}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              localStorage.removeItem('scheduleData');
              localStorage.removeItem('scheduleMeta');
              window.location.reload();
            }}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
          >
            Regenerate Schedule
          </button>
        </div>

        {/* Schedule Table */}
        {tableData.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Daily Action Plan</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    {allDates.map(date => (
                      <th
                        key={date}
                        className="p-4 text-white font-semibold text-center bg-drift-blue/30 border border-white/20 rounded-t-lg"
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
                          className="p-4 border border-white/20 bg-white/5"
                        >
                          {day.tasks[taskIdx] ? (
                            <div className="flex items-center justify-between space-x-3">
                              <span className="text-white text-sm flex-1">{day.tasks[taskIdx]}</span>
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-drift-orange bg-white/20 border-white/30 rounded focus:ring-drift-orange focus:ring-2"
                                checked={checked[dayIdx]?.[taskIdx] || false}
                                onChange={() => handleCheckboxChange(dayIdx, taskIdx)}
                              />
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Daily Progress Bars */}
                  <tr>
                    {tableData.map((day, dayIdx) => {
                      const dayTotal = day.tasks.length;
                      const dayCompleted = checked[dayIdx]?.filter(Boolean).length || 0;
                      const dayProgress = dayTotal === 0 ? 0 : Math.round((dayCompleted / dayTotal) * 100);
                      
                      return (
                        <td key={dayIdx} className="p-4 border border-white/20 bg-drift-blue/20">
                          <div className="space-y-2">
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  dayProgress === 100 ? 'bg-green-400' : 'bg-drift-orange'
                                }`}
                                style={{ width: `${dayProgress}%` }}
                              />
                            </div>
                            <div className="text-center text-white text-xs">
                              {dayCompleted} of {dayTotal} done
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Overall Progress */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Overall Progress</h3>
              <div className="max-w-md mx-auto">
                <div className="h-6 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      progress === 100 ? 'bg-green-400' : 'bg-gradient-to-r from-drift-orange to-drift-pink'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-white">
                  <span className="text-2xl font-bold">{progress}%</span>
                  <span className="text-white/70 ml-2">({completedTasks} of {totalTasks} tasks completed)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <p className="text-xl">No schedule data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleGenerator;