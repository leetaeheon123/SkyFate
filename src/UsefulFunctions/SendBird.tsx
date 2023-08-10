const GotoChatScreen = (navigation: any, channel: any, UserData: any) => {
  navigation.navigate('NoTimeLimitChatScreen', {
    channel,
    UserData,
  });
};

export const CreateChating = async (
  SendBird: Object,
  OtherUserData: Object,
  UserData: Object,
  navigation: any,
  CallBack_Success: Function,
) => {
  let params = new SendBird.GroupChannelParams();

  // 추가로 고려할거 : 이미 채팅하기를 눌러 채팅방이 생성된 상태와 처음 채팅하기를 눌러서 채팅방이 생성되는 상황을 분기처리 하기
  let Member = [OtherUserData.RequestorUid, UserData.Uid];
  let NickNames = [OtherUserData.NickName, UserData.NickName];

  // const Latlng = {
  //   latitude: OtherUserData.latitude,
  //   longitude: OtherUserData.longitude,
  // };

  params.addUserIds(Member);
  params.coverUrl = OtherUserData.ProfileImageUrl;
  params.name = NickNames[0];
  params.operatorUserIds = Member;
  (params.isDistinct = true), (params.isPublic = false);

  SendBird.GroupChannel.createChannel(
    params,
    async function (groupChannel: any, error: Error) {
      if (error) {
        // console.log(error.message);
        // Handle error.
      } else if (!error) {
        // await Update_IsAcceptRequestChating(
        //   OtherUserData.RequestedUid,
        //   OtherUserData.RequestorUid,
        // );
        CallBack_Success();
        GotoChatScreen(navigation, groupChannel, UserData);
      }
    },
  );
};

export {GotoChatScreen};
