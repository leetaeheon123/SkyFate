import firestore from '@react-native-firebase/firestore';
import {UserListRequestChating} from '^/NoMistakeWord';

const UpdateUserAttendFirstEvent = async (UserId: any) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(`UserList`);

    // Firestore에 문서 추가
    const docRef = await collectionRef.doc(`${UserId}`).update({
      FTAttend: true,
    });
    console.log('RequestAttendFirstEvent 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('RequestAttendFirstEvent 문서 추가 에러:', error);
  }
};

const Update_IsAcceptRequestChating = async (
  // 채팅 요청을 받은 사람의 Uid = RequestedUid
  RequestedUid: any,
  // 채팅 요청한 사람의 UserData = RequestorUserData
  RequestorUid: any,
) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(
      `UserList/${RequestedUid}/${UserListRequestChating}`,
    );

    // Firestore에 문서 추가
    await collectionRef.doc(`${RequestorUid}`).update({
      IsAccept: true,
    });
  } catch (error) {
    console.error('Update_IsAcceptRequestChating중 에러:', error);
  }
};

export {UpdateUserAttendFirstEvent, Update_IsAcceptRequestChating};
