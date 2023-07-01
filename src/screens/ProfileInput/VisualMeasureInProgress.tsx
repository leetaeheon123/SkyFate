import React from 'react';
import {View, Dimensions} from 'react-native';
import {
  VisualMeasureInProgressSvg,
  VisualMeasureStart1Svg,
  VisualMeasureStart2Svg,
} from 'component/VisualMeasure/VisualMeasureSvg';
import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {MainColorBtn_Clickable} from 'component/Profile';

const VisualMeasureInProgressScreen = ({navigation, route}: any) => {
  const {width, height} = Dimensions.get('window');

  const GoToNextScreen = async () => {
    navigation.navigate('IndicatorScreen', {
      From: 'LoginAndRegister',
    });
  };

  const ValidComponent = () => {
    return (
      <MainColorBtn_Clickable
        onPress={GoToNextScreen}
        style={[{marginLeft: '5%'}, LoginAndReigsterStyles.Btn_Clickable]}
        Title="랑데부 둘러보기"
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#22124F',
      }}>
      <VisualMeasureInProgressSvg width={width} height={height} />
      {ValidComponent()}
    </View>
  );
};

export default VisualMeasureInProgressScreen;
