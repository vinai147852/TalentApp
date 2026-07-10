export const GetReceiverId = (members, userId) => {
  const receiverId = members?.filter((item) => item !== userId);
  return receiverId[0];
};
