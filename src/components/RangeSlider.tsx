import React from "react";

type RangeSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const RangeSlider = ({ label, value, min, max, onChange }: RangeSliderProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="range" className="block text-sm font-medium text-gray-700 mb-1">
        {label} ({value}px)
      </label>
      <input
        type="range"
        id="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default RangeSlider;
