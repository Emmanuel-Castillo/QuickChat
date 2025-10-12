import ActionButton from "../shared-ui/ActionButton";
import ModalContainer from "../shared-ui/ModalContainer";

const ConfirmationModal = ({
  group,
  onClickNo,
  onClickYes,
}: {
  group: any;
  onClickNo: () => void;
  onClickYes: () => void;
}) => {
  return (
    <ModalContainer>
      <div className="absolute h-screen w-screen bg-[#000000]/60 z-10 flex justify-center items-center px-2">
        <div className=" flex flex-col items-center gap-4 backdrop-blur-2xl text-gray-300 border-2 border-gray-600 rounded-lg overflow-y-scroll p-8">
          <h2 className="text-wrap">
            Are you sure you want to join{" "}
            <span className="text-violet-500">{group.name}</span>?
          </h2>
          <div className="flex flex-wrap gap-4">
            <ActionButton
              buttonText="Yes"
              onClickButton={onClickYes}
              gradientLeft="from-green-400"
              gradientRight="to-green-600"
            />
            <ActionButton
              buttonText="No"
              onClickButton={onClickNo}
              gradientLeft="from-red-400"
              gradientRight="to-red-600"
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ConfirmationModal;
