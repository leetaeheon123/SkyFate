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
import {Type2가로} from 'component/LinearGradient/LinearType';
import {
  ChatLeaveSvg,
  ChatReportSvg,
  CongratulateSvg,
  ExplainLimit_BombSvg,
  L1InviteSvg,
  Text_Message,
} from 'component/Chat/ChatSvg';
import {UpdateFbFirestore} from '^/Firebase';
import {WhiteReportSvg, 취소하기Svg} from 'component/Report/Report';
import {GetUserData} from '^/SaveUserDataInDevice';
import Swiper from 'react-native-swiper';
import {launchImageLibrary} from 'react-native-image-picker';
import {useQuery} from 'react-query';
import {Get_AllUser} from 'Firebase/get';
import {WPer40, WPer42dot5, WPer45, WPer5} from '~/Per';

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

const UserListWantTalkMeScreen = (props) => {
  const {route, navigation} = props;
  const {UserData, UserListWantTalkMe} = route.params;

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        key={item.ProfileImageurl}
        style={UserListWantTalkMeScreenStyle.ImageBox}
        onPress={() => {
          navigation.navigate('DetailViewScreen', {
            UserData,
            OtherUserData: item,
            Type: 'Requested',
          });
        }}>
        <Image
          style={UserListWantTalkMeScreenStyle.ImageBox}
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
      </TouchableOpacity>
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
    <SafeAreaView style={UserListWantTalkMeScreenStyle.container}>
      <View style={UserListWantTalkMeScreenStyle.Main}>
        {Header}

        <View style={UserListWantTalkMeScreenStyle.Explain}>
          <Text>Sensual Plus</Text>
          <MaterialCommunityIcons
            name="cards-heart"
            color="#ff5271"
            size={45}
          />
          <Text style={{fontSize: 30, fontWeight: '800', color: 'black'}}>
            나와 대화하고 싶은 회원
          </Text>
          <View style={styles.ColumnCenter}>
            <Text style={{fontSize: 18, fontWeight: '500', color: '#9DA7B1'}}>
              누군가가 회원님에게 채팅 요청을 보내면
            </Text>
            <Text style={{fontSize: 18, fontWeight: '500', color: '#9DA7B1'}}>
              이곳에서 확인할 수 있어요
            </Text>
          </View>
        </View>

        <FlatList
          data={UserListWantTalkMe} //렌더할 데이터
          renderItem={renderItem} //실제로 렌더될 컴포넌트
          keyExtractor={(item) => item.Uid}
          //없어도 작동은 되지만 미연의 에러방지를 위해 정의하는 것이 좋다.
          //keyExtractor는 반드시 String type이어야 한다.
          horizontal={false}
          bounces={true}
          numColumns={2}
          //   onEndReached={onEndReached}
          onEndReachedThreshold={0.6}

          // ListFooterComponent={loading&&<ActivityIndicator size={"large"}/>}
          // ListEmptyComponent={<ActivityIndicator size={"small"}/>}
        />
      </View>
    </SafeAreaView>
  );
};

const UserListWantTalkMeScreenStyle = StyleSheet.create({
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
    width: WPer42dot5,
    height: WPer42dot5,
    borderRadius: 10,
    marginRight: '5%',
    marginBottom: '3.3%',
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

export default withAppContext(UserListWantTalkMeScreen);
