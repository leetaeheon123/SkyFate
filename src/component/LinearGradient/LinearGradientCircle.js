import LinearGradient from 'react-native-linear-gradient';

export const Type2 = ['#7373F6', '#8B70F7', '#956EF6', '#A869F7'];

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
