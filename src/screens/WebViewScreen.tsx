import {SafeAreaView} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import {Btn_ClickableBack} from 'component/General';

const WebViewScreen = ({navigation, route}) => {
  const {uri} = route.params;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Btn_ClickableBack
        width={12}
        style={{}}
        onPress={() => navigation.goBack()}
      />

      <WebView source={{uri}}></WebView>
    </SafeAreaView>
  );
};

export default WebViewScreen;
