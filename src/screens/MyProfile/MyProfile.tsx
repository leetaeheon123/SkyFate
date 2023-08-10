import React, {useEffect, useState} from 'react';
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
import {MainColor} from '~/Color/OneColor';
import {HPer10, HPer5, WPer10, WPer20, WPer40, WPer60} from '~/Per';
import styles from '~/ManToManBoard';
import {Enter_ChatSvg} from 'component/Map/MapSvg';
import {AppStoreInitConnect} from '^/Iap';

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
const MyProfileScreen = ({route, navigation}: any) => {
  const {UserData} = route.params;

  const ImageArray = [
    UserData.ProfileImageUrl,
    UserData.ProfileImageUrl2,
    UserData.ProfileImageUrl3,
    UserData.ProfileImageUrl4,
    UserData.ProfileImageUrl5,
    UserData.ProfileImageUrl6,
  ];

  const [FiliterImageArray, setImageArray] = useState(
    ImageArray.filter((data) => data != '' && data != undefined),
  );

  const SubImage = (
    <View>
      <LinearGradient
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        colors={['#5B5AF3', '#5B59F3', '#835CF0', '#B567DB']}
        style={MyProfileStyles.linearGradient}>
        {UserData.ProfileImageUrl == '' ? (
          <Ionicons name="person" size={80} />
        ) : (
          <Image
            resizeMode="cover"
            style={MyProfileStyles.SubImage}
            source={{uri: ImageArray[0]}}></Image>
        )}
      </LinearGradient>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MyProfileChangeScreen', {
            UserData,
          });
        }}
        style={{
          width: 27,
          height: 27,
          position: 'absolute',
          right: -3,
          top: -0,
        }}>
        {ChangeProfileSvg}
      </TouchableOpacity>
    </View>
  );

  const ChangeProfile = (
    <LinearGradient
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      colors={['#5B5AF3', '#5B59F3', '#835CF0', '#B567DB']}
      style={MyProfileStyles.linearGradient}></LinearGradient>
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

  return (
    <SafeAreaView style={MyProfileStyles.Body}>
      <ScrollView style={MyProfileStyles.ScrollView}>
        <View style={MyProfileStyles.ImageView}>
          {/* <ProfileTopLine /> */}
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

          <Btn_ClickableEnter_Setting
            width={30}
            onPress={() =>
              navigation.navigate('SettingScreen', {
                UserData,
              })
            }
            style={{position: 'absolute', right: 12, top: 12}}
          />
        </View>
        <View style={[MyProfileStyles.Main]}>
          <View style={MyProfileStyles.Title}>
            {SubImage}
            <Text style={MyProfileStyles.NickName}>{UserData.NickName}</Text>
          </View>
          <View style={MyProfileStyles.Desc}>
            {DescScetion(UserData.Mbti)}
            {DescScetion(UserData.Age)}
            {DescScetion(UserData.MySelfIntro)}
          </View>
        </View>

        <TouchableOpacity
          style={[{width: 30, height: 30, backgroundColor: 'white'}]}
          onPress={() => {
            navigation.navigate('SubscriptionScreen');
          }}>
          <Text>구독화ㅕㄴ각</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.RowCenter,
          {
            position: 'absolute',
            zIndex: 3,
            bottom: 10,
            right: 10,
            // width: WPer60,
            // height: HPer5,
            borderRadius: 20,
            backgroundColor: MainColor,
          },
        ]}
        onPress={() => {
          AppStoreInitConnect();
        }}>
        {Enter_ChatSvg(40)}
        {/* <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: '600',
          }}>
          개발자와 실시간 소통하기
        </Text> */}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
