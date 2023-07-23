import firestore from '@react-native-firebase/firestore';

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

export {UpdateUserAttendFirstEvent};