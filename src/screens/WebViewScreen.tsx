import {SafeAreaView} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const WebViewScreen = ({navigation, route}) => {
  const {uri} = route.params;

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView source={{uri}}></WebView>
    </SafeAreaView>
  );
};

export default WebViewScreen;
