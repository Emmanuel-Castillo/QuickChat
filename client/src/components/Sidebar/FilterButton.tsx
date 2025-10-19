import React from "react";

type FilterButtonProps = {
  buttonText: string;
  isSelected: boolean;
  onClickButton: () => void;
};
const FilterButton = ({ buttonText, isSelected, onClickButton }: FilterButtonProps) => {
  return (
    <button
      className={`flex p-3 cursor-pointer justify-center ${isSelected && "bg-[#282142]/50"}`}
      onClick={onClickButton}
    >
      {buttonText}
    </button>
  );
};

export default FilterButton;
