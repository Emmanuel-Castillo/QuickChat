import React from "react";

type FilterButtonProps = {
  buttonText: string;
  isSelected: boolean;
  onClickButton: () => void;
};
const FilterButton = ({ buttonText, isSelected, onClickButton }: FilterButtonProps) => {
  return (
    <button
      className={`w-1/3 p-3 cursor-pointer ${isSelected && "bg-[#282142]/50"}`}
      onClick={onClickButton}
    >
      {buttonText}
    </button>
  );
};

export default FilterButton;
