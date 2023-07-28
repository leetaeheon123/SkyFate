import React, {useState, useRef} from 'react';
import {
  View,
  Button,
  Platform,
  Text,
  SafeAreaView,
  Alert,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import {VisualMeasureStart1Svg} from 'component/VisualMeasure/VisualMeasureSvg';
import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {
  AgeLine,
  MainColorBtn_ClickableSvg,
  SubTextComponent,
  TextComponent,
} from 'component/ProfileInput/ProfileSvg';
import {AgeStyles} from '~/ProfileInput';
import {
  Btn_ClickableNext,
  Btn_NotClickableNext,
  MainColorBtn_Clickable,
} from 'component/Profile';
import styles from '~/ManToManBoard';
import {WPer100} from '~/Per';

const VisualMeasureStart1Screen = ({navigation, route}: any) => {
  const {width, height} = Dimensions.get('window');

  const {UserEmail, Gender, NickName} = route.params;

  const GoToNextScreen = async () => {
    navigation.navigate('VisualMeasureStart2Screen', {
      UserEmail: UserEmail,
      Gender: Gender,
      NickName: NickName,
    });
  };

  const ValidComponent = () => {
    return (
      <MainColorBtn_Clickable
        onPress={GoToNextScreen}
        style={[{marginLeft: '5%'}, LoginAndReigsterStyles.Btn_Clickable]}
        Title="다음"
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#22124F',
      }}>
      <VisualMeasureStart1Svg width={width} height={height} />

      {ValidComponent()}
    </View>
  );
};

export default VisualMeasureStart1Screen;
