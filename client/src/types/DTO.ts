export type User = {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string | null;
  bio: string;
  friends: string[];
  groups: string[];
  createdAt: string;
  updatedAt: string;
};

export type Group = {
  _id: string;
  name: string;
  founder: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
};

export type FriendMessage = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string | null;
  image: string | null;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GroupMessage = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string | null;
  image: string | null;
  seenMemberIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type FriendRequest = {
  _id: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
};
