import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AchievementCard from "./AchievementCard";

interface Achievement {
  title: string;
  image: string;
  message: string;
}

const AchievementSlider: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev: number) => (prev + 1) % achievements.length);
  const prev = () => setIndex((prev: number) => (prev - 1 + achievements.length) % achievements.length);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-h-[70vh] relative z-10">
      <AchievementCard achievement={achievements[index]} />

      <div className="flex justify-between w-full max-w-xl px-6 mt-4">
        <button
          onClick={prev}
          className="flex items-center gap-2 bg-white text-drift-purple border border-drift-purple px-4 py-2 rounded-md shadow hover:bg-drift-purple hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={next}
          className="flex items-center gap-2 bg-white text-drift-purple border border-drift-purple px-4 py-2 rounded-md shadow hover:bg-drift-purple hover:text-white transition-all duration-200"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AchievementSlider;