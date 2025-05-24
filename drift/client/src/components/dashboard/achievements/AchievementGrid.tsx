// components/dashboard/AchievementGrid.tsx
import React from "react";
import AchievementCard from "./AchievementCard";

interface Achievement {
  title: string;
  image: string;
  message: string;
}

const AchievementGrid: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
      {achievements.map((a, i) => (
        <AchievementCard key={i} achievement={a} />
      ))}
    </div>
  );
};

export default AchievementGrid;
