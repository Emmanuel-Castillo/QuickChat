import React, { useState } from "react";
import ActionButton from "../shared-ui/ActionButton";
import ModalContainer from "../shared-ui/ModalContainer";

const CreateGroupModal = ({
  onClickCreate,
  onClickCancel,
  loading,
}: {
  onClickCreate: (name: string, description: string) => void;
  onClickCancel: () => void;
  loading: boolean;
}) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  return (
    <ModalContainer>
      <div className=" flex flex-col items-center gap-4 backdrop-blur-2xl text-gray-300 border-2 border-gray-600 rounded-lg overflow-y-scroll p-8">
        <h2 className="text-2xl">Create Group</h2>

        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          maxLength={15}
          placeholder="Enter name"
          className="bg-gray-800 py-1 px-2 rounded w-5/6"
          disabled={loading}
        />

        <textarea
          value={newGroupDescription}
          onChange={(e) => setNewGroupDescription(e.target.value)}
          placeholder="Enter description (optional)"
          className="bg-gray-800 py-1 px-2 rounded w-5/6"
          disabled={loading}
        ></textarea>

        <div className="flex flex-wrap gap-4">
          <ActionButton
            buttonText="Create"
            onClickButton={() =>
              onClickCreate(newGroupName, newGroupDescription)
            }
            gradientLeft="from-green-400"
            gradientRight="to-green-600"
            disabled={loading}
          />
          <ActionButton
            buttonText="Cancel"
            onClickButton={onClickCancel}
            gradientLeft="from-red-400"
            gradientRight="to-red-600"
            disabled={loading}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default CreateGroupModal;
