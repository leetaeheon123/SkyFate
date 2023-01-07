import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Switch,
  Image,
  Modal,
  Pressable,
  Dimensions,
  FlatList
} from 'react-native';

import { useQuery } from 'react-query';
import database from '@react-native-firebase/database';

import {firebase} from '@react-native-firebase/database';

import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native'
interface personAge {
  Title: string,
  HowMuchPayIt: number,
  Description: string,
  LevelofGame: number
}

const reference = firebase
  .app()
  .database(
    'https://hunt-d7d89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );

// fb db에 올라가는코드 

const GoToMapScreen = (navigation:any) => {

  navigation.navigate('MapScreen',{ModalOpen: true})
  // MapScreen으로 돌아가면서 Modal이 열려있게 하는게 ux에 더 좋을듯
  // WriteScreen을 navigation위치에서 동일한 위치가 아니라 mapscreen의 자식컴포넌트로 작성하자
  
}




const ManToManBoardWriteScreen = () => {
  const navigation = useNavigation()

  const [Title, onChangeTitle] = useState("");
  const [HowMuchPayIt, onChangeHowMuchPayIt] = useState("");
  const [Description, onChagneDescription] = useState("");
  const [LevelofGame, onChagneLevelofGame] = useState("");

  return (
    <SafeAreaView style={{width:'100%', height:'100%'}}>
     
      {/* 1. title 입력 
      2.사진업로드
      3. 얼마낼건지 입력칸
      4. description 입력
      5. LevelofGame 선택할수있는 칸
      
      */}

      <TextInput
        style={styles.input}
        onChangeText={onChangeTitle}
        value={Title}
      />

      <TextInput
        style={styles.input}
        onChangeText={(Money) => onChangeHowMuchPayIt(Money)}
        value={HowMuchPayIt}
        placeholder="How Much Pay it?"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        onChangeText={(Description) => onChagneDescription(Description)}
        value={Description}
        placeholder="Partner에게 요청하는 바?"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChagneLevelofGame}
        value={LevelofGame}
        placeholder="InPut Level"
        keyboardType="numeric"
      />

      <Button title="Submit"
      onPress={()=>{
        Submit(Title, HowMuchPayIt, Description, LevelofGame, navigation)
      }}
      ></Button>

    </SafeAreaView> 
      
  )

  
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default ManToManBoardWriteScreen;
