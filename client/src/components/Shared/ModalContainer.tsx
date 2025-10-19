import React from "react";

const ModalContainer = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="absolute h-screen w-screen bg-[#000000]/60 z-10 flex justify-center items-center px-2">
        {children}
    </div>
  );
};

export default ModalContainer;
