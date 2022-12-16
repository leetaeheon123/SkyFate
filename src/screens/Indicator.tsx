import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BottomTabScreen from '../../bottomstack';
import ValidInvitationCodeScreen from './ValidInvitationCode';

const IndicatorScreen = (props:any) => {

  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const savedUserKey = 'UserData';

  useEffect(() => {

    AsyncStorage.getItem(savedUserKey)
      .then(user => {
        //유저가 있는경우에 CurrentUUser에 savedUserKey 키를 통해 구해온값 저장
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
        // 그다음에 셋이니셜라이즈
        setInitialized(true);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(()=>{
    console.log(props.route.params)
    AsyncStorage.getItem(savedUserKey)
      .then(user => {
        //유저가 있는경우에 CurrentUUser에 savedUserKey 키를 통해 구해온값 저장
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
      })
      .catch(err => console.error(err));
  }, [props.route.params])


  return (
    <>
     {initialized ? (
        // Best Partice?
        currentUser ? (
          <BottomTabScreen currentUser={currentUser}/>
        ) : (
          <ValidInvitationCodeScreen/>
        )
      ) : (
        <SafeAreaView>
          <ActivityIndicator />
        </SafeAreaView>
      )}
    
    </>
    
  );
}

export default IndicatorScreen;
