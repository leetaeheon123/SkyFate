import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import {
  Alert,
  Platform,
  Image,
  Dimensions,
  AppState,
  Button,
  FlatList,
  KeyboardAvoidingView,
  NativeModules,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {withAppContext} from '../../contextReducer';
import {chatReducer} from '../../reducer/chat';
import Message from '../../component/message';
import {createChannelName} from '../../utilsReducer';

import {AppContext} from '../../UsefulFunctions/Appcontext';
import {GetTime} from '^/GetTime';
import firestore from '@react-native-firebase/firestore';

import {GetEpochTime, MilisToMinutes} from '^/GetTime';
import styles from '~/ManToManBoard';
import {
  BombIconViewNotabs,
  Btn_ClickableBack,
  EmptyBox,
} from 'component/General';
import {useInterval} from '../../utils';
import {useKeyboard} from '@react-native-community/hooks';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import {launchImageLibrary} from 'react-native-image-picker';
import {useQuery} from 'react-query';
import {Get_AllUser} from 'Firebase/get';
import {WPer40, WPer42dot5, WPer45, WPer5, WPer90} from '~/Per';
import {isEmptyArray} from '^/isEmptyObj';
import {CreateChating} from '^/SendBird';
import {Update_IsAcceptRequestChating} from 'Firebase/update';
import {Update_IsAcceptSendHandToMe} from 'Firebase/update';

export const WhyReport = (
  <View
    style={[
      styles.RowCenter,
      {
        width: '100%',
        height: '10%',
        marginBottom: 22,
      },
    ]}>
    <Text
      style={{
        fontSize: 20,
        fontWeight: '600',
        color: '#E8EBF2',
      }}>
      신고 이유는 무엇인가요?
    </Text>
  </View>
);

const UserListSendHandToMeScreen = ({route, navigation}: any) => {
  const {UserData, UserListSendHandToMe} = route.params;
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const renderItem = ({item}: any) => {
    return (
      <View
        key={item.ProfileImageurl}
        style={UserListSendHandToMeScreenStyle.ImageBox}
        onPress={() => {
          navigation.navigate('DetailViewScreen', {
            UserData,
            OtherUserData: item,
            Type: 'Requested',
          });
        }}>
        <Image
          style={UserListSendHandToMeScreenStyle.ImageBox}
          source={{
            uri: item.ProfileImageUrl,
          }}></Image>
        <Text style={{position: 'absolute', color: 'white', bottom: 20}}>
          {item?.NickName}
        </Text>
        <Text
          style={{position: 'absolute', color: 'white', bottom: 0, left: 0}}>
          {item?.Age}
        </Text>
        <Text
          style={{
            position: 'absolute',
            color: 'red',
            bottom: 0,
            right: 0,
          }}>
          {item?.location}
        </Text>
        <TouchableOpacity
          onPress={() => {
            CreateChating(SendBird, item, UserData, navigation, async () => {
              Update_IsAcceptSendHandToMe(item.RequestedUid, item.RequestorUid);
            });
          }}
          style={{
            position: 'absolute',
            width: 100,
            height: 40,
            backgroundColor: 'blue',
            bottom: 30,
            right: 30,
          }}>
          <Text>채팅만들기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Header = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {justifyContent: 'space-between', height: '10%'},
      ]}>
      <Btn_ClickableBack width={14} onPress={() => navigation.goBack()} />
      {/* {Text_Message(66)} */}
      {EmptyBox}
    </View>
  );

  return (
    <SafeAreaView style={UserListSendHandToMeScreenStyle.container}>
      <View style={UserListSendHandToMeScreenStyle.Main}>
        {Header}

        <View style={UserListSendHandToMeScreenStyle.Explain}>
          <Text>Sensual Plus</Text>
          <MaterialCommunityIcons
            name="cards-heart"
            color="#ff5271"
            size={45}
          />
          <Text style={{fontSize: 30, fontWeight: '800', color: 'black'}}>
            나에게 저요를 보낸 회원
          </Text>
          <View style={styles.ColumnCenter}>
            <Text style={{fontSize: 18, fontWeight: '500', color: '#9DA7B1'}}>
              누군가가 회원님이 작성한 경험/로망플에
            </Text>
            <Text style={{fontSize: 18, fontWeight: '500', color: '#9DA7B1'}}>
              저요를 보내면 알려드려요
            </Text>
          </View>
        </View>
        {isEmptyArray(UserListSendHandToMe) == true ? (
          <FlatList
            data={UserListSendHandToMe} //렌더할 데이터
            renderItem={renderItem} //실제로 렌더될 컴포넌트
            keyExtractor={(item) => item.Uid}
            //없어도 작동은 되지만 미연의 에러방지를 위해 정의하는 것이 좋다.
            //keyExtractor는 반드시 String type이어야 한다.
            horizontal={false}
            bounces={true}
            //   onEndReached={onEndReached}
            onEndReachedThreshold={0.6}

            // ListFooterComponent={loading&&<ActivityIndicator size={"large"}/>}
            // ListEmptyComponent={<ActivityIndicator size={"small"}/>}
          />
        ) : (
          <Text>암것도없</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const UserListSendHandToMeScreenStyle = StyleSheet.create({
  container: [
    {
      height: '100%',
      width: '100%',
      backgroundColor: 'white',
    },
    styles.ColumnCenter,
  ],
  Main: {
    width: '90%',
    height: '100%',
  },
  headerRightContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  ImageBox: {
    width: WPer90,
    height: WPer90,
    borderRadius: 10,
    marginRight: '5%',
    marginBottom: '5%',
  },
  Body: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F4F8',
  },
  Explain: [
    styles.Column_OnlyRowCenter,
    {
      width: '100%',
      height: '34%',
      // backgroundColor: 'orange',
      justifyContent: 'space-evenly',
    },
  ],
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
});

export default withAppContext(UserListSendHandToMeScreen);
