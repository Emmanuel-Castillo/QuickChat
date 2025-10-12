import React from "react";

type ActionButtonProps = {
  gradientLeft?: string;
  gradientRight?: string;
  onClickButton: () => void;
  buttonText: string;
};
const ActionButton = ({ gradientLeft = 'from-purple-400', gradientRight = 'to-violet-600', onClickButton, buttonText }: ActionButtonProps) => {
  return (
    <button
      className={`mt-auto bg-gradient-to-r ${gradientLeft} ${gradientRight} text-white border-none text-sm font-light p-2 px-15 rounded-full cursor-pointer`}
      onClick={onClickButton}
    >
      {buttonText}
    </button>
  );
};

export default ActionButton;
