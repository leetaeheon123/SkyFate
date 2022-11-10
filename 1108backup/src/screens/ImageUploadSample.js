import React, {useState} from 'react';
import {
  Platform,
  Pressable,
  Image,
  Button,
  ActivityIndicator,
  SafeAreaView,
  Text,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

function ImageUploadSample() {
  const [response, setResponse] = useState(null);
  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      res => {
        console.log(res);
        if (res.didCancel) return;
        setResponse(res);
      },
    );
  };

  const [loading, setLoading] = useState(false);
  const imageUpload = async () => {
    setLoading(true);
    let imageUrl = null;
    if (response) {
      const asset = response.assets[0];
      const reference = storage().ref(`/profile/${asset.fileName}`); // 업로드할 경로 지정
      if (Platform.OS === 'android') {
        // 안드로이드
        // 파일 업로드
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        // iOS
        // 파일 업로드
        await reference.putFile(asset.uri);
      }
      imageUrl = response ? await reference.getDownloadURL() : null;
    }
    console.log('imageUrl', imageUrl);
    // imageUrl 사용 로직 ...
  };
  

  return (
    <SafeAreaView>
      <Pressable onPress={onSelectImage}>
        <Text>Upload</Text>
        <Image
          style={{width: 200, height: 200}}
          source={{uri: response?.assets[0]?.uri}}
        />
      </Pressable>
      {loading ? (
        <ActivityIndicator
          size={32}
          color="#6200ee"
          style={{width: 200, height: 200}}
        />
      ) : (
        <Button title="다음" onPress={imageUpload} />
      )}
    </SafeAreaView>
  );
}

export default ImageUploadSample;
