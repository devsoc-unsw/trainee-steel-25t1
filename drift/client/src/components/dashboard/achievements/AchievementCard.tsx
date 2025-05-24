// components/dashboard/AchievementCard.tsx
import React from "react";

interface Achievement {
  title: string;
  image: string;
  message: string;
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xl w-full">
      <img
        src={achievement.image}
        alt={achievement.title}
        className="w-full max-h-64 object-cover rounded-md mb-6"
      />
      <h2 className="text-2xl font-semibold text-drift-blue mb-2">{achievement.title}</h2>
      <p className="text-gray-700">{achievement.message}</p>
    </div>
  );
};

export default AchievementCard;