import React from "react";

type ActionButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
  hoverColor: string;
};

const ActionButton = ({
  onClick,
  icon,
  label,
  bgColor,
  textColor,
  hoverColor
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 border ${bgColor} ${textColor} rounded-md hover:${hoverColor} transition-colors`}
    >
      {icon}
      {label}
    </button>
  );
};

export default ActionButton;
