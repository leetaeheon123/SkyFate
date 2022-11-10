import React, { useRef, useState } from "react";
import { Animated, Dimensions, Easing, Pressable, TouchableOpacity, View,Text 

,SafeAreaView
} from "react-native";


function TestScreen() {
  

  


  return (
    <SafeAreaView style={{width:'100%', height:'100%', backgroundColor:'skyblue'}}>
      <View style={{width:'100%', height:'100%', backgroundColor:'red'}}>
      </View>
      <View style={{width:'100%', height:'10%', backgroundColor:'gray'
      ,position:'relative',
      top:10,
      left:10
    }}>
      <Text style={{}}>Hello</Text>

      </View>
    </SafeAreaView>
    
    
  );
}

export default TestScreen;
