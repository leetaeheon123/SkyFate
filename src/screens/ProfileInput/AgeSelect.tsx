import React, {useState, useRef} from 'react';
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
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {
  AgeLine,
  SubTextComponent,
  TextComponent,
} from 'component/Profile/ProfileSvg';
import {AgeStyles} from '~/ProfileInput';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';

const AgeSelectScreen = ({navigation, route}: any) => {
  const {UserEmail, Gender, NickName} = route.params;

  const ValidNum = (value: any) => {
    return !isNaN(parseFloat(value));
  };

  const UpdateAge = async () => {
    let YearOfBirthStr = `${focusone}${focustwo}${focusthree}${focusfour}`;
    let YearOfBirth = Number(YearOfBirthStr);

    let Age = 2023 - YearOfBirth + 1;
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      Age: Age,
    });

    navigation.navigate('ProfileImageSelectScreen', {
      UserEmail: UserEmail,
      Gender: Gender,
      NickName: NickName,
    });
  };

  const ValidComponent = () => {
    let onevalid = ValidNum(focusone);
    let twovalid = ValidNum(focustwo);
    let threevalid = ValidNum(focusthree);
    let fourvalid = ValidNum(focusfour);

    if (onevalid && twovalid && threevalid && fourvalid) {
      return (
        <Btn_ClickableNext
          onPress={() => {
            UpdateAge();
          }}
        />
      );
    } else {
      return <Btn_NotClickableNext />;
    }
  };
  const [focusone, setfocusone] = useState<string>('');
  const [focustwo, setfocustwo] = useState<string>('');
  const [focusthree, setfocusthree] = useState<string>('');
  const [focusfour, setfocusfour] = useState<string>('');

  const ref_input1 = useRef(null);
  const ref_input2 = useRef(null);
  const ref_input3 = useRef(null);
  const ref_input4 = useRef(null);

  const TextInputGen = (
    setvalue: Function,
    ref: any,
    nextref: any = null,
    afterref: any = null,
    value: any,
  ) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View style={AgeStyles.TextInput}>
          <TextInput
            style={{
              // backgroundColor: 'gray',
              width: 36,
              height: 36,
            }}
            value={value}
            onChangeText={(newValue) => setvalue(newValue)}
            ref={ref}
            textAlign={'center'}
            maxLength={1}
            onKeyPress={(keyPress) => {
              const key = keyPress.nativeEvent.key;
              if (key == 'Backspace') {
                if (afterref) {
                  afterref.current.focus();
                }
              } else {
                if (nextref) {
                  nextref.current.focus();
                }
              }
            }}
            keyboardType="numeric"
            autoFocus={ref == ref_input1 ? true : false}
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
        <Pressable
          style={{
            height: '50%',
            width: '100%',
          }}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {TextInputGen(setfocusone, ref_input1, ref_input2, null, focusone)}
            {TextInputGen(
              setfocustwo,
              ref_input2,
              ref_input3,
              ref_input1,
              focustwo,
            )}
            {TextInputGen(
              setfocusthree,
              ref_input3,
              ref_input4,
              ref_input2,
              focusthree,
            )}
            {TextInputGen(
              setfocusfour,
              ref_input4,
              null,
              ref_input3,
              focusfour,
            )}
          </View>

          {SubTextComponent('Age')}
        </Pressable>

        {ValidComponent()}
      </View>
    </SafeAreaView>
  );
};

export default AgeSelectScreen;
