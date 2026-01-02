import React from 'react';

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
            checked ? 'transform translate-x-4' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};