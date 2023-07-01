import React from 'react';
import {View, Dimensions} from 'react-native';
import {
  VisualMeasureInProgressSvg,
  VisualMeasureStart1Svg,
  VisualMeasureStart2Svg,
  VisualMeasureSuccessSvg,
} from 'component/VisualMeasure/VisualMeasureSvg';
import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {MainColorBtn_Clickable} from 'component/Profile';
import firestore from '@react-native-firebase/firestore';

const VisualMeasureNotCheckSuccessScreen = ({navigation, route}: any) => {
  const {width, height} = Dimensions.get('window');
  const {UserEmail, Gender, NickName} = route.params;

  const UpdateVisualMeasureStatus = async () => {
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      VisualMeasureStatus: 'Success',
    });
  };

  const GoToNextScreen = async () => {
    await UpdateVisualMeasureStatus();
    navigation.navigate('IndicatorScreen', {
      From: 'LoginAndRegister',
    });
  };

  const ValidComponent = () => {
    return (
      <MainColorBtn_Clickable
        onPress={GoToNextScreen}
        style={[{marginLeft: '5%'}, LoginAndReigsterStyles.Btn_Clickable]}
        Title="시작하기"
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#22124F',
      }}>
      <VisualMeasureSuccessSvg width={width} height={height} />
      {ValidComponent()}
    </View>
  );
};

export default VisualMeasureNotCheckSuccessScreen;
