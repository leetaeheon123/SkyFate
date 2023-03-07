import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
import {TAutocompleteDropdownItem} from 'react-native-autocomplete-dropdown';
export const ft = firestore();

export const GetFbFirestore = async (
  CollectionPath: string,
  DocPath: string,
) => {
  return ft
    .collection(`${CollectionPath}`)
    .doc(`${DocPath}`)
    .get()
    .then((doc) => doc.data());
};

export const DeleteInFbFirestore = async (
  CollectionPath: string,
  DocPath: string,
) => {
  firestore()
    .collection(`${CollectionPath}`)
    .doc(`${DocPath}`)
    .delete()
    .then(() => {
      console.log('Success DeleteInFbFirestore');
    });
};

export const UpdateFbFirestore = async (
  CollectionPath: string,
  DocPath: string,
  Data: string,
  value: any,
) => {
  firestore()
    .collection(`${CollectionPath}`)
    .doc(`${DocPath}`)
    .update({
      [Data]: value,
    })
    .then(() => {
      console.log('Success UpdateInFbFirestore');
    });
};

export const GetUserNickNameList = async (
  MyGender: number,
  setState: Function,
) => {
  const Result = await firestore().collection('UserList').get();

  let MansNickNameList: TAutocompleteDropdownItem[] = [];
  let GirlsNickNameList: TAutocompleteDropdownItem[] = [];

  let obj;

  Result.forEach((doc, index) => {
    const Gender = doc.data().Gender;
    const UserEmail = doc.data().UserEmail;

    const NickNmae = doc.data().NickName;
    obj = {id: String(index), title: NickNmae, UserEmail: UserEmail};

    if (Gender == 1) {
      MansNickNameList = [...MansNickNameList, obj];
    } else if (Gender == 2) {
      GirlsNickNameList = [...GirlsNickNameList, obj];
    }
  });

  if (MyGender == 1) {
    setState(MansNickNameList);
    console.log(MansNickNameList);
  } else if (MyGender == 2) {
    console.log(GirlsNickNameList);

    setState(GirlsNickNameList);
  }
};

export const GetFriendProfileImage = async (FriendEmail: string = '') => {
  if (FriendEmail == '') {
    return {
      Age: '',
      Mbti: '',
      ProfileImageUrl: '',
      ProfileImageUrl2: '',
      NickName: '',
    };
  }

  try {
    const FriendData = await ft
      .collection('UserList')
      .doc(FriendEmail)
      .get()
      .then((doc) => doc.data());

    console.log(FriendData);

    return FriendData;
  } catch (e) {
    Alert.alert('입력된 사용자가 존재하지 않습니다');
    console.log('Error');
  }
};
