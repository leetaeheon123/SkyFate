import React, { useEffect, useState } from 'react';
import MapScreen from './src/screens/map';
import TwoMapScreen from './src/screens/twomap';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { withAppContext } from './src/contextReducer';


const BottomTab = createMaterialBottomTabNavigator();

const BottomTabScreen = (props:any) => {


  const [InvitationCodeToFriend, setInvitationCodeToFriend] = useState<Object>(null);


  // console.log("BottomTabScreen:", props.currentUser)
  // const GetInvitationToFriendCode = (PkNumber:Number) => {
  //   return (
  //   firebase.firestore().collection(`InvitationCodeList`).doc(`${String(PkNumber)}`)
  //   .get()
  //   )
  // }

  // useEffect(()=>{
  //   GetInvitationToFriendCode(props.currentUser.PkNumber).then(doc => {
  //     const Code = doc.data()
  //     if(Code) {
  //       console.log(Code)
  //       setInvitationCodeToFriend(Code)
  //     }
  //   })
  // }, [props.currentUser])



  // 성별 가져오는 코드 필요합니다 - 2022 10 09 오후1시.

    return (
      <BottomTab.Navigator
        >
         <BottomTab.Screen
         name="MapScreen"
         component={MapScreen}
         initialParams={{
           CurrentUser: props.currentUser,
         }}
       />
       {props.currentUser.Gender == 2 ? 
        <BottomTab.Screen
        name="TwoMapScreen"
        component={TwoMapScreen}
        initialParams={{
          CurrentUser: props.currentUser,
        }}
      />
       :null}
       
       
       
      </BottomTab.Navigator>

    );
};

export default withAppContext(BottomTabScreen);
