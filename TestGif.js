import React, {useEffect} from 'react';
import {ActivityIndicator, SafeAreaView} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import {Text, Image, View} from 'react-native';

import FastImage from 'react-native-fast-image';

// const YourImage = () => (
//     <FastImage
//         style={{ width: 200, height: 200 }}
//         source={{
//             uri: 'https://unsplash.it/400/400?image=1',
//             headers: { Authorization: 'someAuthToken' },
//             priority: FastImage.priority.normal,
//         }}
//         resizeMode={FastImage.resizeMode.contain}
//     />
// )

function TestGifScreen() {
  return (
    <View>
      {/* <Image
        style={{
          width: 200,
          height: 200,
        }}
        source={require('./1.jpeg')}
      /> */}
      {/* <Image
        style={{
          height: 200,
          width: 200,
        }}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      /> */}
      {/* <FastImage
        style={{ width: 200, height: 200 }}
        source={{
            // uri: 'https://unsplash.it/400/400?image=1',
            headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
    /> */}
      <FastImage
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('./snowgif.gif')}
      />
    </View>
  );
}

export default TestGifScreen;
