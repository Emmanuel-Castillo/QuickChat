import React from "react";

type ActionButtonProps = {
  gradientLeft?: string;
  gradientRight?: string;
  disabled?: boolean;
  onClickButton: () => void;
  buttonText: string;
};
const ActionButton = ({
  gradientLeft = "from-purple-400",
  gradientRight = "to-violet-600",
  onClickButton,
  buttonText,
  disabled,
}: ActionButtonProps) => {
  return (
    <button
      className={`bg-gradient-to-r ${gradientLeft} ${gradientRight} ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } text-white border-none text-sm font-light p-2 px-15 rounded-full`}
      onClick={onClickButton}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default ActionButton;
