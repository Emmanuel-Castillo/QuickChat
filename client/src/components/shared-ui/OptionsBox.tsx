import React from "react";
import assets from "../../assets/assets";

export type Action = {
  text: string;
  onClickAction: () => void;
};
type OptionsBoxProps = {
  actions: Action[];
};
const OptionsBox = ({ actions }: OptionsBoxProps) => {
  return (
    <div className="relative py-2 group">
      <img src={assets.menu_icon} alt="menu" className="h-5 cursor-pointer" />
      <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:flex flex-col gap-4">
        {actions.map((a, index) => (
          <div key={index}>
            <p className="cursor-pointer text-sm" onClick={a.onClickAction}>
              {a.text}
            </p>
            <hr className="my-2 border-t border-gray-500 not-last:block hidden" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsBox;
