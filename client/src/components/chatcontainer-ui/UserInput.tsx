import React, { useState } from "react";
import toast from "react-hot-toast";
import { useChat } from "../../../context/ChatContext";
import assets from "../../assets/assets";

export const UserInput = ({
  disabled,
  chatType,
}: {
  disabled: boolean;
  chatType: "user" | "group";
}) => {
  const { sendGroupMessage, sendMessage } = useChat();
  const [input, setInput] = useState("");

  // Handle sending a message
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    chatType === "group"
      ? await sendGroupMessage({ text: input.trim() })
      : await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending an image
  const handleSendImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      chatType === "group"
        ? await sendGroupMessage({ image: reader.result })
        : await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
      <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
        <input
          type="text"
          placeholder="Send a message"
          className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          disabled={disabled}
        />
        <input
          onChange={handleSendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
          disabled={disabled}
        />
        <label htmlFor="image">
          <img
            src={assets.gallery_icon}
            alt=""
            className="w-5 mr-2 cursor-pointer"
          />
        </label>
      </div>
      <img
        onClick={() => {
          if (!disabled) handleSendMessage;
        }}
        src={assets.send_button}
        alt=""
        className="w-7 cursor-pointer"
      />
    </div>
  );
};
