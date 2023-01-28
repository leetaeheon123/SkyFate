import LinearGradient from "react-native-linear-gradient";

export const Type2Circle = (width, height) =>{
    return(
        <LinearGradient
          colors={['#7373F6', '#8B70F7', '#956EF6', '#A869F7']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            width:width,
            height:height,
            borderRadius:width/2
          }}>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </LinearGradient>
    )
}