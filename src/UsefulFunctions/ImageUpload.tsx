import {launchImageLibrary} from 'react-native-image-picker';
import {Platform} from 'react-native';

import {GetEpochTime} from './GetTime';
import storage from '@react-native-firebase/storage';

import firestore from '@react-native-firebase/firestore';

export const ChangeMyProfileImage = async (
  UserEmail: string,
  Gender: number,
  navigation: any,
  index: number,
) => {
  let UploadCallback = async (LocalImagePath: string) => {
    const StorageUrl = await PutInStorage(LocalImagePath, UserEmail, Gender);

    await UpdateProfileImageUrl(UserEmail, StorageUrl, navigation, index);
  };

  ImagePicker(UploadCallback);
};

const ImagePicker = (callback: Function) => {
  const back: string = 'back';
  const duration: number = 10;
  const result = launchImageLibrary(
    {
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      videoQuality: 'high',
      durationLimit: duration,
      quality: 1,
      cameraType: back,
      includeBase64: Platform.OS === 'android',
      includeExtra: false,
      saveToPhots: false,
      selectionLimit: 1,
      // presentationStyle:'fullScreen'
    },
    async (res) => {
      if (res.didCancel) return;
      let LocalImagePath = res.assets[0].uri;
      callback(LocalImagePath);
    },
  );
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
      ProfileImage4Url: StorageUrl,
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
};

const UpdateProfileImageUrl = async (
  UserEmail: string,
  StorageUrl: string,
  navigation: any,
  index: number,
) => {
  let UpdateProfileImageUrl = Obj[index];

  await UpdateProfileImageUrl(UserEmail, StorageUrl);
  navigation.navigate('IndicatorScreen', {
    From: 'ImageUpload',
  });
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
