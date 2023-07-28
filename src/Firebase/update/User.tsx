import firestore from '@react-native-firebase/firestore';
import {NotCheckSuccess} from '^/NoMistakeWord';

const ChangeVisualMeasureOneUser = async (UserId: any, StatusValue: String) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(`UserList`);

    // Firestore에 문서 추가
    const docRef = await collectionRef.doc(`${UserId}`).update({
      VisualMeasureStatus: StatusValue,
    });
    console.log('RequestAttendFirstEvent 새 문서 ID:', docRef);
  } catch (error) {
    console.error('RequestAttendFirstEvent 문서 추가 에러:', error);
  }
};



export {ChangeVisualMeasureOneUser};
