import React from "react";

interface AboutMeProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ name, value, onChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">About Me</h2>
      <textarea
        name={name}
        placeholder="Write about yourself..."
        className="textarea w-full border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default AboutMe;
