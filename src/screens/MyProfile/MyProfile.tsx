import React, {useEffect} from 'react';
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
} from 'react-native';
import {MyProfileStyles} from '~/MyProfile';
import LinearGradient from 'react-native-linear-gradient';
import {ChangeProfileSvg} from 'component/Profile/ProfileSvg';

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
          source={{uri: UserData.ProfileImageUrl}}></Image>
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

  const DescScetion = (Description: string) => {
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
      <View style={MyProfileStyles.ImageView}>
        <Image
          resizeMode="cover"
          style={MyProfileStyles.FullImage}
          source={{uri: UserData.ProfileImageUrl}}></Image>
      </View>
      <View style={MyProfileStyles.Main}>
        <View style={MyProfileStyles.Title}>
          {SubImage}
          <Text style={MyProfileStyles.NickName}>{UserData.NickName}</Text>
        </View>
        <View style={MyProfileStyles.Desc}>
          {DescScetion(UserData.Mbti)}
          {DescScetion(UserData.Age)}
          {DescScetion('딘내이상형')}
        </View>
      </View>
      {/* <View style={MyProfileStyles.footer}></View> */}
    </SafeAreaView>
  );
};

export default MyProfileScreen;
