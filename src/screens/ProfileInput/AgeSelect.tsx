import React, {} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';

import { LoginAndReigsterStyles } from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore'


const AgeSelectScreen = ({navigation, route}:any) => {

  console.log(route.params.UserEmail)
  const {UserEmail} = route.params

  const UpdateAge = async () => {
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      Age: 22
    })

    navigation.navigate("ProfileImageSelectScreen", {
      UserEmail:UserEmail,
    })
  }

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
            나이를 선택해주세요
          </Text>
        </View>
        <View
          style={{
            height: '50%',
            width: '100%',
          }}>
        </View>

        <View style={LoginAndReigsterStyles.CheckBox}>
        <Pressable
          style={LoginAndReigsterStyles.CheckBt}
          onPress={() => {
            UpdateAge()
          }}>
          <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
        </Pressable>
      </View>
     
      </View>
    </SafeAreaView>
  );
};



export default AgeSelectScreen;