import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  PermissionsAndroid,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  AppState,
  FlatList,
  RefreshControl,
  Switch,
  Pressable,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from 'react-native';
import {MyProfileStyles} from '~/MyProfile';
import LinearGradient from 'react-native-linear-gradient';
import {ChangeProfileSvg} from 'component/ProfileInput/ProfileSvg';
import {Btn_ClickableBack, Btn_ClickableEnter_Setting} from 'component/General';
import {ProfileTopLine} from 'component/Profile';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ValidFalsy} from '^/ValidFalsy';
import {Create_RequestChating} from 'Firebase/create';
import {Update_IsAcceptRequestChating} from 'Firebase/update';

import {Legacy_Get_AllUser} from 'Firebase/FbForMigration';
import {AppContext} from '^/Appcontext';
import {GotoChatScreen} from '^/SendBird';

export const DescCricle = (
  <LinearGradient
    start={{x: 0, y: 0.5}}
    end={{x: 1, y: 0.5}}
    colors={['#7373F6', '#8B70F7', '#956EF6', '#A869F7']}
    style={MyProfileStyles.DescCircle}></LinearGradient>
);

export const DescBottomline = (
  <LinearGradient
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    colors={['#502EF5', '#6E36E6', '#7F41DC', '#A258C8', '#CA6CB0']}
    style={MyProfileStyles.DescBottomLine}></LinearGradient>
);

export const DescBottomlineCustom = (style) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#502EF5', '#6E36E6', '#7F41DC', '#A258C8', '#CA6CB0']}
      style={style}></LinearGradient>
  );
};
const DetailViewScreen = ({route, navigation}: any) => {
  const {UserData, OtherUserData, Type} = route.params;

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const ImageArray = [
    OtherUserData.ProfileImageUrl,
    // UserData.ProfileImageUrl2,
    // UserData.ProfileImageUrl3,
    // UserData.ProfileImageUrl4,
    // UserData.ProfileImageUrl5,
    // UserData.ProfileImageUrl6,
  ];

  useEffect(() => {
    Legacy_Get_AllUser();
  }, []);

  const [FiliterImageArray, setImageArray] = useState(
    ImageArray.filter((data) => ValidFalsy(data) != false),
  );

  const SubImage = (
    <View>
      <LinearGradient
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        colors={['#5B5AF3', '#5B59F3', '#835CF0', '#B567DB']}
        style={MyProfileStyles.linearGradient}>
        <Image
          resizeMode="cover"
          style={MyProfileStyles.SubImage}
          source={{uri: ImageArray[0]}}></Image>
      </LinearGradient>
    </View>
  );

  const DescScetion = (Description: string = '') => {
    return (
      <View style={MyProfileStyles.DescBox}>
        {DescCricle}
        <View style={MyProfileStyles.TextBox}>
          <Text style={MyProfileStyles.Mbti}>{Description}</Text>
          {DescBottomline}
        </View>
      </View>
    );
  };

  const RequestChating = () => {
    Create_RequestChating(OtherUserData.Uid, UserData);
  };

  const CreateChating = async () => {
    let params = new SendBird.GroupChannelParams();

    // 추가로 고려할거 : 이미 채팅하기를 눌러 채팅방이 생성된 상태와 처음 채팅하기를 눌러서 채팅방이 생성되는 상황을 분기처리 하기
    let Member = [OtherUserData.RequestorUid, UserData.Uid];
    let NickNames = [OtherUserData.NickName, UserData.NickName];

    // const Latlng = {
    //   latitude: OtherUserData.latitude,
    //   longitude: OtherUserData.longitude,
    // };

    params.addUserIds(Member);
    params.coverUrl = OtherUserData.ProfileImageUrl;
    params.name = NickNames[0];
    params.operatorUserIds = Member;
    (params.isDistinct = true), (params.isPublic = false);
    const OtherMetadDataKey = 'CanSendL1Invite_' + Member[0];
    const MyMetadDataKey = 'CanSendL1Invite_' + Member[1];

    SendBird.GroupChannel.createChannel(
      params,
      async function (groupChannel: any, error: Error) {
        if (error) {
          // console.log(error.message);
          // Handle error.
        } else if (!error) {
          // SwitchShowUserModal();
          // await CreateCanSendMetaData(
          //   groupChannel,
          //   OtherMetadDataKey,
          //   OtherUserData.UserEmail,
          //   MyMetadDataKey,
          //   UserData.UserEmail,
          // );
          await Update_IsAcceptRequestChating(
            OtherUserData.RequestedUid,
            OtherUserData.RequestorUid,
          );
          GotoChatScreen(navigation, groupChannel, UserData);
        }
      },
    );
  };

  const ReqResBtn = () => {
    if (Type === 'Request') {
      return (
        <Button title="채팅 걸기" onPress={() => RequestChating()}></Button>
      );
    } else if (Type == 'Requested') {
      return (
        <Button
          title="채팅 수락하기"
          onPress={() => {
            CreateChating();
          }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={MyProfileStyles.Body}>
      <ScrollView style={MyProfileStyles.ScrollView}>
        <View style={MyProfileStyles.ImageView}>
          <Swiper
            paginationStyle={{
              width: '70%',
              height: 2.5,
              position: 'absolute',
              top: 24,
              left: '15%',
              display: 'flex',
              flexDirection: 'row',
              zIndex: 10,
            }}
            dot={
              <View
                style={{
                  height: '100%',
                  width: `${100 / FiliterImageArray.length}%`,
                  backgroundColor: '#00000014',
                  borderRadius: 4,
                  marginLeft: 4.5,
                }}
              />
            }
            activeDot={
              <View
                style={{
                  height: '100%',
                  width: `${100 / FiliterImageArray.length}%`,
                  backgroundColor: 'white',
                  borderRadius: 4,
                  marginLeft: 4.5,
                }}
              />
            }>
            {FiliterImageArray.map((data, index) => {
              return (
                <Image
                  key={data + index}
                  resizeMode="cover"
                  style={MyProfileStyles.FullImage}
                  source={{uri: data}}
                />
              );
            })}
          </Swiper>

          <Btn_ClickableBack
            width={17}
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', left: 12, top: 12}}
          />
        </View>
        <View style={MyProfileStyles.Main}>
          <View style={MyProfileStyles.Title}>
            {SubImage}
            <Text style={MyProfileStyles.NickName}>
              {OtherUserData.NickName}
            </Text>
          </View>
          <View style={MyProfileStyles.Desc}>
            {DescScetion(OtherUserData.Mbti)}
            {DescScetion(OtherUserData.Age)}
            {DescScetion(OtherUserData.IntroduceText)}
          </View>
          {ReqResBtn()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailViewScreen;
