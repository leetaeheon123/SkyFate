import LinearGradient from 'react-native-linear-gradient';
import {Type2, Type3} from './LinearType';
import {Image} from 'react-native';
import styles from '~/ManToManBoard';
export const Type2Circle = (width, height) => {
  return (
    <LinearGradient
      colors={['#7373F6', '#8B70F7', '#956EF6', '#A869F7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{
        width: width,
        height: height,
        borderRadius: width / 2,
      }}>
      <Text style={styles.buttonText}>Sign in with Facebook</Text>
    </LinearGradient>
  );
};

export const Type2ProfileImageCircle = (
  width,
  height,
  ProfileImageUrl,
  style = {},
) => {
  return (
    <LinearGradient
      colors={['#7373F6', '#8B70F7', '#956EF6', '#A869F7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[
        styles.RowCenter,
        style,
        {
          width: width,
          height: height,
          borderRadius: width / 2,
        },
      ]}>
      <Image
        style={{
          width: width - 3.5,
          height: height - 3.5,
          borderRadius: width / 2,
        }}
        source={{uri: ProfileImageUrl}}></Image>
    </LinearGradient>
  );
};

export const Type2VerticalLine = (height) => {
  return (
    <LinearGradient
      colors={Type2}
      start={{x: 0.5, y: 0}}
      end={{x: 0, y: 0}}
      style={{
        width: 2,
        height: height,
      }}></LinearGradient>
  );
};

export const Type3Rectangle = (props) => {
  const {style} = props;
  console.log('style:', style);
  return (
    <LinearGradient
      colors={Type3}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={style}></LinearGradient>
  );
};


