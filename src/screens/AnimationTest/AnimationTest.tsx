import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, Text, StyleSheet, Animated, Easing} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function AnimationTestScreen() {

  const Y = useRef(new Animated.Value(0)).current
  const X = useRef(new Animated.Value(0)).current

  const [up, setup] = useState(true)

  const changeup = () => setup((prev) => !prev)

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const MoveUp = () => {
    Animated.timing(Y, {
      // toValue: up ? 200 : 0,
      toValue: 200,
      useNativeDriver:true,
      // easing: Easing.circle
    }).start()
    // Animated.timing(X, {
    //   toValue: up ? 100 : -100,
    //   useNativeDriver:true,
    //   duration: 500
    // }).start()
  }

  // const ds = Y.interpolate({
  //   inputRange: [0, -100, 100],
  //   outputRange: [1, 0, 1]
  // })



  Y.addListener(()=>{
    console.log(Y)
  })

  const Th = () => {
    return (
      <Animated.View style={[AniSt.Th, {transform: [
        {
          translateY:Y
        }, 
      ]
      }]}
      >
         
      </Animated.View>
    )
  }


  return (
    <SafeAreaView style={AniSt.Main}>
      <TouchableOpacity 
        onPress={MoveUp}
      >
      {Th()}

      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

const AniSt = StyleSheet.create({
  Main : {
    flex:1,
    // justifyContent:'center',
    // alignItems:'center'
  },
  Th : {
    backgroundColor:'tomato',
    width:100,
    height:100,
    // borderRadius:100
  }
})

export default AnimationTestScreen;
