import React, {useState} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';

import { LoginAndReigsterStyles } from '../../styles/LoginAndRegiser';

const ProfileImageSelect = (props:any) => {

  return (
    <SafeAreaView
      style={LoginAndReigsterStyles.Body}>
      <View
        style={LoginAndReigsterStyles.Main}>
        <View
          style={LoginAndReigsterStyles.Description}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color:'black'
            }}>
            사진을 선택해주세요
          </Text>
        </View>
        <View
          style={LoginAndReigsterStyles.Center}>
            <Text>Hello</Text>
        </View>

        <View style={LoginAndReigsterStyles.CheckBox}>
        <Pressable
          style={LoginAndReigsterStyles.CheckBt}
          onPress={() => {
            
          }}>
          <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
        </Pressable>
      </View>
     
      </View>
    </SafeAreaView>
  );
};



export default ProfileImageSelect;