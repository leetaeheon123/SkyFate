import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
const Create_User = async (UserData: any) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(`UserList`);

    // Firestore에 문서 추가
    const docRef = await collectionRef.doc(`${UserData?.Uid}`).set(UserData);
    console.log('Create_User 새 문서 ID:', docRef?.id);
  } catch (error) {
    console.error('Create_User 문서 추가 에러:', error);
  }
};

const ChangeUserGender = async (Uid: any, Gender: String) => {
  let GenderNum;

  if (Gender == '남성') {
    GenderNum = 1;
  } else if (Gender == '여성') {
    GenderNum = 2;
  } else if (Gender == undefined) {
    GenderNum = null;
  }

  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(`UserList`);

    // Firestore에 문서 추가
    await collectionRef.doc(`${Uid}`).update({
      Gender: GenderNum,
    });
  } catch (error) {
    console.error('ChangeUserGender 문서 추가 에러:', error);
  }
};

const ChangeUserProfileImageUrl = async (Uid: any, Url: string | null) => {
  try {
    // Firestore 컬렉션 참조
    const collectionRef = firestore().collection(`UserList`);

    // Firestore에 문서 추가
    const DocRef = await collectionRef.doc(`${Uid}`).update({
      ProfileImageUrl: Url,
      // ProfileImageurl: firebase.firestore.FieldValue.delete(),
    });
    console.log('ChangeUserProfileImageUrl');
  } catch (error) {
    console.error('ChangeUserProfileImageUrl 문서 추가 에러:', error);
  }
};

const DataChnage = async (UserData: any) => {
  const Obj = {
    ...UserData,
    Age: UserData?.age ?? null,
    Bdsm: UserData?.bdsm ?? null,
    NickName: UserData?.display_name ?? null,
    UserEmail: UserData?.email ?? null,
    Gender: UserData?.gender ?? null,
    Uid: UserData?.uid ?? null,
    ProfileImageUrl: UserData?.photo_url ?? null,
    CreatedAt: UserData?.created_time ?? null,
    Weight: UserData?.weight ?? null,
    Height: UserData?.height ?? null,
    DesiredBdsm: desiredbdsm,
    DesiredGender: desiredgender,
    DetailBdsm: detailbdsm,
    Lgbt: lgbt,
    // 나한테 좋아요를 보낸 모든 사람
    Likes: likes,
    Location,
    // 매치가 된 모든사람
    matches,
    // 내가 받은 좋아요에 나도 좋아요를 보낸 사람들
    metoo,
    //
    // 내가 모노가미가 가능하면 True (나는 한명이랑만 할 수 있다),
    // 아니면 False (나는 한명이랑만 할 수 없다)
    IsPossibleMonoGamy: monogame,
    // 이동 가능여부
    MyAvailability: move,
    IsPossibleMyOnlinePlay: online,
    MyIntro: self - intro,
    IsUnder18: under18,
    MyWantIntro: want,
    MyWantType: want - type,
  };

  delete Obj?.age;
  delete Obj?.bdsm;
  delete Obj?.display_name;
  delete Obj?.email;
  delete Obj?.gender;
  delete Obj?.uid;
  delete Obj?.photo_url;
  delete Obj?.created_time;
  delete Obj?.weight;
  delete Obj?.height;
  Create_User(Obj);
};

const Legacy_Get_AllUser = async () => {
  const AttendedUserEmailList: any = [];
  const Array1: any = [];
  const Array2: any = [];
  try {
    // Firestore 컬렉션 참조
    const collectionRef = await firestore().collection('users').get();
    const collectionRef2 = await firestore()
      .collection('UserList')
      .where('NickName', '==', 'Ddd')
      .get();
    // 데이터가 잘 이전되었는지 체크하기
    // console.log(collectionRef.size);
    // console.log(collectionRef2.size);

    // 문서 데이터 처리
    let i = 0;

    // for (const doc of collectionRef.docs) {
    // const data = doc.data();
    // DataChnage(data);
    // ChangeUserProfileImageUrl(data?.uid, data?.photo_url);
    // i = i + 1;
    // if (i > 50) {
    // break;
    // }
    // Array1.push(data);
    // }
    let k = 0;
    let j = 0;

    for (const doc of collectionRef2.docs) {
      const data = doc;

      console.log('data:', data.id);

      // ChangeUserProfileImageUrl(data?.Uid, data?.ProfileImageurl);
      // if (i > 1000) {
      //   break;
      // }
      // if (data.ProfileImageUrl == undefined || data.ProfileImageUrl == '') {
      //   if (data.ProfileImageUrl != null) {
      //     k = k + 1;
      //     console.log(data.Uid, data.ProfileImageurl);
      //     // ChangeUserProfileImageUrl(data?.Uid, null);
      //   }
      //   if (data.ProfileImageUrl != null && data.ProfileImageUrl === '') {
      //     j = j + 1;
      //   }
      // }

      // if (data.Gender != 1 && data.Gender != 2) {
      //   console.log(data.Uid, data.Gender);
      // }
      // ChangeUserGender(data.Uid, data.Gender);
    }

    // console.log('k:', k);
    // console.log('j:', j);

    // const difference = Array1.filter(
    //   (item1: any) => !Array2.some((item2: any) => item2.Uid === item1.uid),
    // );
    // console.log('Diff');
    // console.log(difference); // 차이를 추출한 배열이 출력됨
  } catch (error) {
    console.error('Legacy_Get_AllUser:', error);
  }

  return AttendedUserEmailList;
};

const Legacy_Get_OneUser = async () => {
  const AttendedUserEmailList: any = [];

  try {
    // Firestore 컬렉션 참조
    const Result = await firestore()
      .collection('UserList')
      .doc('0FTAdLVUfNgwXjJMv15nthu333x2')
      .get();
    // 컬렉션의 모든 문서 가져오기

    // One
    const data = Result.data();
    // DataChnage(data);
    // ChangeUserGender(data?.Uid, data?.Gender);
    ChangeUserProfileImageUrl(data?.Uid, data?.ProfileImageurl);
  } catch (error) {
    console.error('Get_EventAttendedUserList:', error);
  }

  return AttendedUserEmailList;
};

export {Legacy_Get_AllUser, Legacy_Get_OneUser, Create_User};
