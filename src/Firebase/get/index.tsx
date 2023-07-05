import firestore from '@react-native-firebase/firestore';
import {NotCheckSuccess} from '^/NoMistakeWord';

const Get_EventAttendedUserDataList = async (Gender) => {
  const AttendedUserList: any = [];

  let FilterGender;
  if (Gender == 1) {
    FilterGender = 2;
  } else if (Gender == 2) {
    FilterGender = 1;
  }

  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('Event/First/AttendedUserList')
      .where('Gender', '==', FilterGender)
      .get();

    // 컬렉션의 모든 문서 가져오기

    // 문서 데이터 처리
    collectionRef.forEach((doc) => {
      const data = doc.data();
      AttendedUserList.push(data);
    });
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserList;
};

const Get_EventAttendedUserEmailList = async () => {
  const AttendedUserEmailList: any = [];

  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('Event/First/AttendedUserList')
      .get();

    // 컬렉션의 모든 문서 가져오기

    // 문서 데이터 처리
    collectionRef.forEach((doc) => {
      const data = doc.data().UserEmail;
      AttendedUserEmailList.push(data);
    });
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserEmailList;
};

const Get_UserListAiByAdmin = async () => {
  const AttendedUserList: any = [];
  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('UserList')
      .where('InvitationCode', '==', 'ROTHPT')
      .get();

    // 컬렉션의 모든 문서 가져오기

    // 문서 데이터 처리
    collectionRef.forEach((doc) => {
      const data = doc.data();
      AttendedUserList.push(data);
    });
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserList;
};

const Get_WaitAiUserListAiByAdmin = async () => {
  const AttendedUserList: any = [];
  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('UserList')
      .where('VisualMeasureStatus', '==', 'Start')
      .get();

    // 컬렉션의 모든 문서 가져오기

    // 문서 데이터 처리
    collectionRef.forEach((doc) => {
      const data = doc.data();
      AttendedUserList.push(data);
    });
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserList;
};

const Get_AiSuccessUserListByAdmin = async () => {
  const AttendedUserList: any = [];
  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('UserList')
      .where('VisualMeasureStatus', '==', 'Success')
      .get();

    // 컬렉션의 모든 문서 가져오기

    // 문서 데이터 처리
    collectionRef.forEach((doc) => {
      const data = doc.data();
      AttendedUserList.push(data);
    });
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserList;
};

const Get_NotCheckSuccessUserListByAdmin = async () => {
  const AttendedUserList: any = [];
  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('UserList')
      .where('VisualMeasureStatus', '==', 'NotCheckSuccess')
      .get();

    // 컬렉션의 모든 문서 가져오기

    // 문서 데이터 처리
    collectionRef.forEach((doc) => {
      const data = doc.data();
      AttendedUserList.push(data);
    });
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserList;
};

export {
  Get_EventAttendedUserDataList,
  Get_EventAttendedUserEmailList,
  Get_UserListAiByAdmin,
  Get_WaitAiUserListAiByAdmin,
  Get_AiSuccessUserListByAdmin,
  Get_NotCheckSuccessUserListByAdmin,
};
