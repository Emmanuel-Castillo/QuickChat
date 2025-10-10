import React from "react";

type FilterButtonProps = {
  isSelected: boolean;
  onClickButton: () => void;
};
const FilterButton = ({ isSelected, onClickButton }: FilterButtonProps) => {
  return (
    <button
      className={`w-1/2 p-3 cursor-pointer ${isSelected && "bg-[#282142]/50"}`}
      onClick={onClickButton}
    >
      Users
    </button>
  );
};

export default FilterButton;
