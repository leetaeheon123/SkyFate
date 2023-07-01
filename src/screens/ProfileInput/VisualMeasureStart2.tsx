import React from 'react';
import {View, Dimensions} from 'react-native';
import {
  VisualMeasureStart1Svg,
  VisualMeasureStart2Svg,
} from 'component/VisualMeasure/VisualMeasureSvg';
import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {MainColorBtn_Clickable} from 'component/Profile';

const VisualMeasureStart2Screen = ({navigation, route}: any) => {
  const {width, height} = Dimensions.get('window');

  const {UserEmail, Gender, NickName} = route.params;

  const GoToNextScreen = async () => {
    navigation.navigate('ProfileImageSelectScreen', {
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
        Title="Ai 외모 측정하기"
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#22124F',
      }}>
      <VisualMeasureStart2Svg width={width} height={height} />

      {ValidComponent()}
    </View>
  );
};

export default VisualMeasureStart2Screen;
