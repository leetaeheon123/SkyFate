import {PermissionsAndroid, Platform} from 'react-native';

const requestGalleryPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Gallery Permission',
        message: 'Your app needs access to the gallery',
        buttonPositive: 'OK',
      },
    );

    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   console.log('Gallery permission granted');
    // } else {
    //   console.log('Gallery permission denied');
    // }
  } catch (error) {
    console.warn(error);
  }
};

const hasAndroidPermission = async () => {
  //외부 스토리지를 읽고 쓰는 권한 가져오기
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

const getPhotoWithPermission = async () => {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }
};

export {requestGalleryPermission, getPhotoWithPermission};
