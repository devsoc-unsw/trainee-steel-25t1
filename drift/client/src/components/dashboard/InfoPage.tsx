import React from "react";
import muscleLadderImg from "../../assets/muscle_ladder.jpg";
import academicSuccessImg from "../../assets/academic_success.jpg";
import sevenHabitsImg from "../../assets/seven_habits.jpg";
import _48lopImg from "../../assets/48lop.jpg"

const sources = [
  {
    category: "Fitness",
    title: "The Muscle Ladder: Get Jacked Using Science - Jeff Nippard",
    image: muscleLadderImg,
    description: "A comprehensive, science-based guide to building muscle and developing a strong physique.",
  },
  {
    category: "Study",
    title: "Guide to Academic Success - Jun Yuh",
    image: academicSuccessImg,
    description: "Strategies for effective studying, productivity, and career preparation.",
  },
  {
    category: "Habit",
    title: "The Seven Habits of Highly Effective People - Stephen Covey",
    image: sevenHabitsImg,
    description: "Timeless principles for personal and professional effectiveness.",
  },
  {
    category: "Life",
    title: "The 48 Laws of Power - Robert Greene",
    image: _48lopImg,
    description: "The laws for attaining power in life, business, and more",
  },
];


const contributors = [
  "Tony Bui",
  "Vittorio Worang",
  "Carlson Perez",
  "Adib Akbari",
  "Raj Bal",
  // Add more names as needed
];

const InfoPage: React.FC = () => (
  <div className="max-w-3xl mx-auto py-8 px-4 text-white">
    <h1 className="text-3xl font-bold mb-8">Knowledge Sources by Category</h1>
    <div className="space-y-8">
      {sources.map((src) => (
        <div key={src.category} className="flex flex-col md:flex-row items-center bg-white/10 rounded-lg p-6 shadow-md">
          <img src={src.image} alt={src.title} className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-8" />
          <div>
            <h2 className="text-2xl font-semibold">{src.category}</h2>
            <h3 className="text-lg font-medium mt-1">{src.title}</h3>
            <p className="mt-2 text-white/80">{src.description}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-12 border-t border-white/20 pt-8">
      <h2 className="text-2xl font-semibold mb-2">Project Contributors</h2>
      <ul className="list-disc list-inside text-white/80">
        {contributors.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default InfoPage;