import React from "react";

interface BirthdatePickerProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BirthdatePicker: React.FC<BirthdatePickerProps> = ({ name, value, onChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Birthdate</h2>
      <input
        type="date"
        name={name}
        className="input px-3 py-4 border border-gray-500 rounded-lg placeholder-gray-500 text-xl"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default BirthdatePicker;
