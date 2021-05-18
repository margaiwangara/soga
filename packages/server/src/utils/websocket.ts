export type OnlineUser = {
  userId: string;
  socketId: string;
};

export const addOnlineUser = (
  users: OnlineUser[],
  { userId, socketId }: OnlineUser,
) => {
  if (users.some((user) => user.userId !== userId)) {
    return {
      userId,
      socketId,
    };
  }
  return;
};
