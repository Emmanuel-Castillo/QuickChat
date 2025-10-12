export function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function filterUsers(input: string, users: any) {
  return input
    ? users.filter((user: any) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;
}

export function filterGroups(input: string, groups: any) {
  return input
    ? groups.filter((group: any) =>
        group.name.toLowerCase().includes(input.toLowerCase())
      )
    : groups;
}
