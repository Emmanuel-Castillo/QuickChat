import assets from "../../assets/assets";
type GroupBarProps = {
  group: any;
  isSelectedGroup: boolean;
  index: number;
  onClickGroup: () => void;
};
const GroupBar = ({
  group,
  isSelectedGroup,
  index,
  onClickGroup,
}: GroupBarProps) => {
  return (
    <div
      key={index}
      className={`relative flex items-center gap-2 p-3 rounded cursor-pointer max-sm:text-sm 
                ${isSelectedGroup && "bg-[#282142]/50"} hover:bg-[#282142]/50`}
      onClick={onClickGroup}
    >
      <img
        src={group?.profilePic || assets.avatar_icon}
        alt=""
        className="w-[35px] aspect-[1/1] rounded-full"
      />
      <div className="flex flex-col leading-5 truncate">
        <p>{group.name}</p>
      </div>
    </div>
  );
};

export default GroupBar;
