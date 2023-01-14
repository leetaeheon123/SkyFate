import React from 'react';
import {
  View,
  Button,
  Platform,
  Text,
  SafeAreaView,
  Alert,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {
  AgeLine,
  SubTextComponent,
  TextComponent,
} from 'component/Profile/ProfileSvg';
import styles from '~/ManToManBoard';
import {AgeStyles} from '~/ProfileInput';
const AgeSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail, Gender} = route.params;

  const UpdateAge = async () => {
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      Age: 22,
    });

    navigation.navigate('ProfileImageSelectScreen', {
      UserEmail: UserEmail,
      Gender: Gender,
    });
  };

  const TextInputGen = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          // backgroundColor: 'black',
        }}>
        <View style={AgeStyles.TextInput}>
          <TextInput
            textAlign={'center'}
            maxLength={1}
            underlineColorAndroid="red"
            onKeyPress={() => {
              // console.log("Hello")
            }}
            onEndEditing={() => {
              console.log('Hello');
            }}
          />
        </View>
        {AgeLine()}
      </View>
    );
  };

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('Age')}
        </View>
        <View
          style={{
            height: '50%',
            width: '100%',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {TextInputGen()}
            {TextInputGen()}
            {TextInputGen()}
            {TextInputGen()}
          </View>

          {SubTextComponent('Age')}
        </View>

        <View style={LoginAndReigsterStyles.CheckBox}>
          <Pressable
            style={LoginAndReigsterStyles.CheckBt}
            onPress={() => {
              UpdateAge();
            }}>
            <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AgeSelectScreen;
