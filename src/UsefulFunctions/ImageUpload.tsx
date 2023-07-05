// import {launchImageLibrary} from 'react-native-image-picker';
import {Platform} from 'react-native';

import {GetEpochTime} from './GetTime';
import storage from '@react-native-firebase/storage';

import firestore from '@react-native-firebase/firestore';
import {SendBirdUpdateUserInfo} from 'Screens/Indicator';
import ImagePicker from 'react-native-image-crop-picker';
export const ChangeMyProfileImage = async (
  UserEmail: string,
  Gender: number,
  navigation: any,
  index: number,
  setState: Function,
  NickName: string,
  SendBird: any = null,
) => {
  let UploadCallback = async (LocalImagePath: string) => {
    const StorageUrl = await PutInStorage(LocalImagePath, UserEmail, Gender);

    setState(StorageUrl);

    await UpdateProfileImageUrl(
      UserEmail,
      StorageUrl,
      navigation,
      index,
      NickName,
      SendBird,
    );
  };

  ImagePickerLaunch(UploadCallback);
};

const ImagePickerLaunch = (callback: Function) => {
  const back: string = 'back';
  const duration: number = 10;
  // const result = launchImageLibrary(
  //   {
  //     mediaType: 'photo',
  //     maxWidth: 512,
  //     maxHeight: 512,
  //     videoQuality: 'high',
  //     durationLimit: duration,
  //     quality: 1,
  //     cameraType: back,
  //     includeBase64: Platform.OS === 'android',
  //     includeExtra: false,
  //     saveToPhots: false,
  //     selectionLimit: 1,
  //     // presentationStyle:'fullScreen'
  //   },
  //   async (res) => {
  //     if (res.didCancel) return;
  //     let LocalImagePath = res.assets[0].uri;
  //     setState(LocalImagePath);
  //     callback(LocalImagePath);
  //   },
  // );

  ImagePicker.openPicker({
    width: 1200,
    height: 1599,
    cropping: true,
  })
    .then(async (res) => {
      if (res?.didCancel) return;
      let LocalImagePath = res.path;
      callback(LocalImagePath);
    })
    .catch((error) => {
      // 사진 선택 취소 이벤트 처리
      console.log(error);
    });
};

const PutInStorage = async (
  LocalImagePath: any,
  UserEmail: string,
  Gender: any,
) => {
  const EpochTime = GetEpochTime();

  let GenderStr = GenderNumToStr(Gender);
  const DBUrl = `/ProfileImage/${GenderStr}/${UserEmail}`;
  // console.log("DBUrl:" , DBUrl)
  const reference = storage().ref(`${DBUrl}/${EpochTime}/ProfileImage`);
  // console.log("LocalImagePath",LocalImagePath)
  await reference.putFile(LocalImagePath);
  const StorageUrl = await reference.getDownloadURL();
  return StorageUrl;
};

const UpdateProfileImage1UrlInFT = async (
  UserEmail: string,
  StorageUrl: string,
  NickName: string,
  SendBird: any,
) => {
  await firestore()
    .collection(`UserList`)
    .doc(UserEmail)
    .update({
      ProfileImageUrl: StorageUrl,
    })
    .then(() => {
      console.log('Scuessful UpdateProfileImageUrl');
    });
  if (SendBird) {
    SendBirdUpdateUserInfo(SendBird, NickName, StorageUrl);
  }
};

const UpdateProfileImage2UrlInFT = async (
  UserEmail: string,
  StorageUrl: string,
) => {
  await firestore()
    .collection(`UserList`)
    .doc(UserEmail)
    .update({
      ProfileImageUrl2: StorageUrl,
    })
    .then(() => {
      console.log('Scuessful UpdateProfileImageUrl');
    });
};

const UpdateProfileImage3UrlInFT = async (
  UserEmail: string,
  StorageUrl: string,
) => {
  await firestore()
    .collection(`UserList`)
    .doc(UserEmail)
    .update({
      ProfileImageUrl3: StorageUrl,
    })
    .then(() => {
      console.log('Scuessful UpdateProfileImageUrl');
    });
};

const UpdateProfileImage4UrlInFT = async (
  UserEmail: string,
  StorageUrl: string,
) => {
  await firestore()
    .collection(`UserList`)
    .doc(UserEmail)
    .update({
      ProfileImageUrl4: StorageUrl,
    })
    .then(() => {
      console.log('Scuessful UpdateProfileImageUrl');
    });
};

const UpdateProfileImage5UrlInFT = async (
  UserEmail: string,
  StorageUrl: string,
) => {
  await firestore()
    .collection(`UserList`)
    .doc(UserEmail)
    .update({
      ProfileImageUrl5: StorageUrl,
    })
    .then(() => {
      console.log('Scuessful UpdateProfileImageUrl');
    });
};

const UpdateProfileImage6UrlInFT = async (
  UserEmail: string,
  StorageUrl: string,
) => {
  await firestore()
    .collection(`UserList`)
    .doc(UserEmail)
    .update({
      ProfileImageUrl6: StorageUrl,
    })
    .then(() => {
      console.log('Scuessful UpdateProfileImageUrl');
    });
};

const Obj = {
  1: UpdateProfileImage1UrlInFT,
  2: UpdateProfileImage2UrlInFT,
  3: UpdateProfileImage3UrlInFT,
  4: UpdateProfileImage4UrlInFT,
  5: UpdateProfileImage5UrlInFT,
  6: UpdateProfileImage6UrlInFT,
};

const UpdateProfileImageUrl = async (
  UserEmail: string,
  StorageUrl: string,
  navigation: any,
  index: number,
  NickName: string,
  SendBird: any,
) => {
  let UpdateProfileImageUrl = Obj[index];

  await UpdateProfileImageUrl(UserEmail, StorageUrl, NickName, SendBird);
  // navigation.navigate('IndicatorScreen', {
  //   From: 'ImageUpload',
  // });
};

export const GenderNumToStr = (GenderNum: Number) => {
  let GenderStr: string;

  if (GenderNum == 1) {
    GenderStr = 'Mans';
  } else if (GenderNum == 2) {
    GenderStr = 'Girls';
  } else {
    GenderStr = 'except';
  }

  return GenderStr;
};
