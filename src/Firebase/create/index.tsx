import firestore from '@react-native-firebase/firestore';

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

export {RequestAttendFirstEvent, RequestAttendFirstEventBackUp};
