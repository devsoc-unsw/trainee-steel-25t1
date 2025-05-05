import React from 'react';

const ColorPalette: React.FC = () => {
  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-center mb-6">Drift Color Palette</h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="w-full h-24 bg-drift-orange rounded-lg shadow-md"></div>
          <p className="mt-2 text-sm font-medium">#FCBB6D</p>
          <p className="text-xs">drift-orange</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-24 bg-drift-pink rounded-lg shadow-md"></div>
          <p className="mt-2 text-sm font-medium">#D8737F</p>
          <p className="text-xs">drift-pink</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-24 bg-drift-mauve rounded-lg shadow-md"></div>
          <p className="mt-2 text-sm font-medium">#AB6C82</p>
          <p className="text-xs">drift-mauve</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-24 bg-drift-purple rounded-lg shadow-md"></div>
          <p className="mt-2 text-sm font-medium">#685D79</p>
          <p className="text-xs">drift-purple</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-24 bg-drift-blue rounded-lg shadow-md"></div>
          <p className="mt-2 text-sm font-medium">#475C7A</p>
          <p className="text-xs">drift-blue</p>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette; 