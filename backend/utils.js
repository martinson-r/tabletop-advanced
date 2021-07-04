export const sessionizeUser = user => {
    return { userId: user.id, userName: user.userName };
  }
