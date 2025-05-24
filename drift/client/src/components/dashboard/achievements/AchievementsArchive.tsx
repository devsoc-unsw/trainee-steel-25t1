import React, { useState } from "react";
import AchievementSlider from "./AchievementSlider";
import AchievementGrid from "./AchievementGrid";

const dummyAchievements = [
  {
    title: "🎸 Practice guitar for 15 minutes daily",
    image: "https://plus.unsplash.com/premium_photo-1681738776622-77ee3eef2062?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    message: "🎉 Congrats! You nailed your daily guitar practice goal. Keep it up!",
  },
  {
    title: "📚 Finish reading 'Atomic Habits'",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    message: "👏 Well done on completing a great book! Now apply those habits.",
  },
  {
    title: "🏃‍♂️ Run 5K without stopping",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
    message: "🔥 Incredible endurance! You've proven your discipline.",
  },
];

const AchievementsArchive = () => {
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue px-4 py-12">
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-drift-blue">Achievement Archive</h1>
        <button
          onClick={() => setViewAll(!viewAll)}
          className="text-sm text-drift-blue underline hover:text-drift-purple"
        >
          {viewAll ? "View Slideshow" : "View All"}
        </button>
      </div>

      {viewAll ? (
        <AchievementGrid achievements={dummyAchievements} />
      ) : (
        <AchievementSlider achievements={dummyAchievements} />
      )}
    </div>
  );
};

export default AchievementsArchive;