import {WithLocalSvg} from 'react-native-svg';
import FirstEventPoster from 'Assets/FirstEvent/FirstEventPoster.svg';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
export const FirstEventSvg = () => (
  <WithLocalSvg
    asset={FirstEventPoster}
    width={width * 1.1}
    style={{
      marginLeft: -2,
      marginTop: -10,
      marginBottom: '10%',
    }}
  />
);
