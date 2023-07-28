import {ChangeProfileSvg} from 'component/ProfileInput/ProfileSvg';
import {Image, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MyProfileStyles} from '~/MyProfile';
export const MP_C_Image = ({ProfileImageUrl, sty}) => (
  <View>
    <LinearGradient
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      colors={['#5B5AF3', '#5B59F3', '#835CF0', '#B567DB']}
      style={[MyProfileStyles.linearGradient, sty]}>
      <Image
        resizeMode="cover"
        style={MyProfileStyles.SubImage}
        source={{uri: ProfileImageUrl}}
      />
    </LinearGradient>
  </View>
);
