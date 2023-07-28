const GotoChatScreen = (navigation: any, channel: any, UserData: any) => {
  navigation.navigate('NoTimeLimitChatScreen', {
    channel,
    UserData,
  });
};

export {GotoChatScreen};
