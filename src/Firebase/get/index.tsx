import firestore from '@react-native-firebase/firestore';

const Get_AllUser = async (Gender: number | null) => {
  const UserList: any = [];

  console.log('Gender AllUser:', Gender);

  let FilterGender;
  if (Gender == 1) {
    FilterGender = 2;
  } else if (Gender == 2) {
    FilterGender = 1;
  } else if (Gender == null) {
    FilterGender = 1;
  }
  try {
    const collectionRef = await firestore()
      .collection('UserList')
      .where('Gender', '==', FilterGender)
      .get();

    let i = 0;

    for (const doc of collectionRef.docs) {
      const data = doc.data();
      if (
        data?.ProfileImageurl != null &&
        data?.ProfileImageurl != undefined &&
        data?.ProfileImageurl != ''
      ) {
        UserList.push(data);
      }
      i = i + 1;
      if (i == 50) {
        // break;
      }
    }
  } catch (error) {
    console.error('Get_AllUser Error:', error);
  }

  return UserList;
};

const Get_UserListWantTalkMe = async (Uid: string) => {
  const UserListSendHandToMe: any = [];
  const Path = `UserList/${Uid}/UserListSendHandToMe`;
  try {
    const collectionRef = await firestore()
      .collection(Path)
      .where('IsAccept', '==', false)
      .get();

    for (const doc of collectionRef.docs) {
      const data = doc.data();
      UserListSendHandToMe.push(data);
    }
  } catch (error) {
    console.error('Get_UserListWantTalkMe:', error);
  }

  return UserListSendHandToMe;
};
const Get_UserListSendHandToMe = async (Uid: string) => {
  const UserListSendHandToMe: any = [];
  const Path = `UserList/${Uid}/UserListSendMe`;
  try {
    const collectionRef = await firestore()
      .collection(Path)
      .where('IsAccept', '==', false)
      .get();

    for (const doc of collectionRef.docs) {
      const data = doc.data();
      UserListSendHandToMe.push(data);
    }
  } catch (error) {
    console.error('Get_UserListSendHandToMe:', error);
  }

  return UserListSendHandToMe;
};

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

const Get_UserListAiByACDGKU = async () => {
  const AttendedUserList: any = [];
  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore()
      .collection('UserList')
      .where('InvitationCode', '==', 'ACDGKU')
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

  return AttendedUserList.length;
};

const Get_AllFeed = async (Gender: number | null) => {
  const FeedList: any = [];

  let FilterGender;
  if (Gender == 1) {
    FilterGender = 2;
  } else if (Gender == 2) {
    FilterGender = 1;
  } else if (Gender == null) {
    FilterGender = 1;
  }
  try {
    const collectionRef = await firestore()
      .collection('FeedList')
      .where('Gender', '==', FilterGender)
      .get();

    for (const doc of collectionRef.docs) {
      const data = doc.data();
      FeedList.push(data);
    }
  } catch (error) {
    console.error('Get_AllFeed Error:', error);
  }

  return FeedList;
};

export {
  Get_AllUser,
  Get_UserListWantTalkMe,
  Get_UserListSendHandToMe,
  Get_EventAttendedUserDataList,
  Get_EventAttendedUserEmailList,
  Get_UserListAiByAdmin,
  Get_WaitAiUserListAiByAdmin,
  Get_UserListAiByACDGKU,
  Get_AllFeed,
};
