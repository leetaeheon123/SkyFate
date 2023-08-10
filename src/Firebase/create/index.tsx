import firestore from '@react-native-firebase/firestore';
import {GetEpochTime} from '^/GetTime';
import {UserListRequestChating, UserListSendMe} from '^/NoMistakeWord';

const RequestAttendFirstEvent = async (UserData: any) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(
      `Event/First/AttendedUserList`,
    );

    // Firestore에 문서 추가
    const docRef = await collectionRef
      .doc(`${UserData?.UserEmail}`)
      .set(UserData);
    console.log('RequestAttendFirstEvent 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('RequestAttendFirstEvent 문서 추가 에러:', error);
  }
};

const RequestAttendFirstEventBackUp = async (UserData: any) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(
      `EventBackUp/First/AttendedUserList`,
    );

    // Firestore에 문서 추가
    const docRef = await collectionRef
      .doc(`${UserData?.UserEmail}`)
      .set(UserData);
    console.log('RequestAttendFirstEvent 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('RequestAttendFirstEvent 문서 추가 에러:', error);
  }
};

const Create_RequestChating = async (
  // 채팅 요청을 받은 사람의 Uid = RequestedUid
  RequestedUid: any,
  // 채팅 요청한 사람의 UserData = RequestorUserData
  RequestorUserData: any,
) => {
  const CreatedAt = GetEpochTime();

  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(
      `UserList/${RequestedUid}/${UserListRequestChating}`,
    );

    const RequestorUid = RequestorUserData.Uid;

    // 추후 혼선을 방지하기 위해 Uid를 객체에서 삭제함
    delete RequestorUserData.Uid;

    // Firestore에 문서 추가
    const docRef = await collectionRef.doc(`${RequestorUid}`).set({
      CreatedAt,
      RequestedUid,
      RequestorUid,
      IsAccept: false,
      ...RequestorUserData,
    });
    console.log('Create_RequestChating 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('Create_RequestChating 문서 추가 에러:', error);
  }
};

const Create_SendMe = async (
  // 저요를 받은 사람의 Uid = RequestedUid
  RequestedUid: any,
  // 저요를 보낸 사람의 UserData = RequestorUserData
  RequestorUserData: any,
) => {
  const CreatedAt = GetEpochTime();

  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(
      `UserList/${RequestedUid}/${UserListSendMe}`,
    );

    const RequestorUid = RequestorUserData.Uid;

    // 추후 혼선을 방지하기 위해 Uid를 객체에서 삭제함
    delete RequestorUserData.Uid;

    // Firestore에 문서 추가
    const docRef = await collectionRef.doc(`${RequestorUid}`).set({
      CreatedAt,
      RequestedUid,
      RequestorUid,
      IsAccept: false,
      ...RequestorUserData,
    });
    console.log('Create_SendMe 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('Create_SendMe 문서 추가 에러:', error);
  }
};

const Create_Feed = async (FeedDesc: String, UserData: any) => {
  const CreatedAt = GetEpochTime();

  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(`FeedList`);

    // 추후 혼선을 방지하기 위해 Uid를 객체에서 삭제함
    // Firestore에 문서 추가
    const docRef = await collectionRef.add({
      FeedDesc,
      CreatedAt,
      ...UserData,
    });
    console.log('Create_Feed 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('Create_Feed 문서 추가 에러:', error);
  }
};

export {
  RequestAttendFirstEvent,
  RequestAttendFirstEventBackUp,
  Create_RequestChating,
  Create_SendMe,
  Create_Feed,
};
