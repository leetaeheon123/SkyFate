import React, { useRef, useState } from "react";
import { Animated, Dimensions, Easing, Pressable, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
  rotation:"220deg"
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);

function AnimationTestScreen2() {
  const [up, setUp] = useState(false);
  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window")

  const POSITION = useRef(new Animated.ValueXY({x:-SCREEN_WIDTH /2 + 100, y:-SCREEN_HEIGHT /2 + 100})).current;

  //Chapter 7

  // const toggleUp = () => setUp((prev) => !prev);
  // const moveUp = () => {
  //   Animated.timing(POSITION, {
  //     toValue: up ? 300 : -300,
  //     useNativeDriver: true,
  //     easing: Easing.circle,
  //     duration: 1000,
  //   }).start(toggleUp);
  // };


  const topLeft = Animated.timing(POSITION, {
      toValue: {
        x: -SCREEN_WIDTH /2 + 100,
        y: -SCREEN_HEIGHT /2 +100
      },
      useNativeDriver: false
    })



  const topRight = Animated.timing(POSITION, {
      toValue: {
        x: SCREEN_WIDTH /2 - 100,
        y: -SCREEN_HEIGHT /2 + 100
      },
      useNativeDriver: false
    })

  

  const bottomRight = Animated.timing(POSITION, {
      toValue: {
        x: SCREEN_WIDTH /2 - 100,
        y: SCREEN_HEIGHT /2 - 100
      },
      useNativeDriver: false
    })

  
  const bottomLeft = Animated.timing(POSITION, {
      toValue: {
        x: -SCREEN_WIDTH /2 +100,
        y: SCREEN_HEIGHT /2 -100
      },
      useNativeDriver: false
    })

  

  const moveUp = () => {
    Animated.loop(
      Animated.sequence([topRight, bottomRight, bottomLeft,topLeft])
    ).start()
  }
  
  const opacity = POSITION.y.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0, 1],
  });
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  
  const rotation = POSITION.y.interpolate({
    inputRange:[-300, 300],
    outputRange:["-360deg" , "360deg"]
  })

  const bgColor = POSITION.y.interpolate({
    inputRange: [-300,300],
    outputRange: ["rgb(255,99,71)","rgb(71,166,255)"],
  })


  POSITION.addListener(() => {
  });
  return (
    <Container>
      {/* <View style={{
        width:100,
        height:100,
        backgroundColor:'turquoise',
        transform:[ {rotateZ:"230deg"}]
      }}></View> */}
      <Pressable onPress={moveUp}>
        <AnimatedBox
          style={{
            borderRadius,
            backgroundColor: bgColor,
            transform: [...POSITION.getTranslateTransform()]
          }}
        />
      </Pressable>
    </Container>
  );
}

export default AnimationTestScreen2;
