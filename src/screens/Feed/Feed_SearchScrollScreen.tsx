import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import {
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {withAppContext} from '../../contextReducer';
import {GetEpochTime, MilisToMinutes} from '^/GetTime';
import styles from '~/ManToManBoard';

import {useQuery} from 'react-query';
import {Get_AllUser} from 'Firebase/get';
import {WPer45, WPer5, WPer80, WPer90} from '~/Per';
import {MP_C_Image} from 'component/MyProfile';

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

const Feed_SearchScrollScreen = (props) => {
  const {route, navigation} = props;

  const {channel, UserData} = route.params;

  const {width} = Dimensions.get('window');

  const {data: UserList, isLoading: UserListisLoading} = useQuery(
    'UserListkey',
    () => Get_AllUser(1),
  );

  const renderItem = ({item}: any) => {
    return (
      <View
        key={item.ProfileImageurl}
        style={[style.ImageBox, {marginLeft: '5%'}]}
        onPress={() => {
          navigation.navigate('DetailViewScreen', {
            UserData: UserData,
            OtherUserData: item,
            Type: 'Request',
          });
        }}>
        <View
          style={{
            position: 'absolute',
          }}>
          <MP_C_Image
            ProfileImageUrl={item.ProfileImageUrl}
            sty={{margin: 10}}
          />
          <View
            style={[
              {
                position: 'absolute',
                left: 114,
                top: 20,
              },
              styles.Column_OnlyFlex,
            ]}>
            <Text
              style={{
                color: 'white',
                fontSize: 19,
                fontWeight: '700',
              }}>
              {item?.Age} {item?.NickName}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                fontWeight: '300',
              }}>
              서울
            </Text>
          </View>
        </View>

        <Text>Feed</Text>
        <TouchableOpacity
          style={[
            styles.RowCenter,
            {
              position: 'absolute',
              width: WPer80,
              height: 45,
              bottom: 10,
              left: '5%',
              backgroundColor: 'white',
              borderRadius: 8,
            },
          ]}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
            }}>
            저요 보내기
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          margin: '5%',
        }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: 'white',
          }}>
          하고 싶은{'\n'}
          플레이가 있을 때
        </Text>
      </View>

      {UserListisLoading == false ? (
        <FlatList
          data={UserList} //렌더할 데이터
          renderItem={renderItem} //실제로 렌더될 컴포넌트
          keyExtractor={(item) => item.Uid}
          //없어도 작동은 되지만 미연의 에러방지를 위해 정의하는 것이 좋다.
          //keyExtractor는 반드시 String type이어야 한다.
          horizontal={false}
          bounces={true}
          //   onEndReached={onEndReached}
          onEndReachedThreshold={0.6}
          //   ListHeaderComponent={<Text>나는 헤더다</Text>}
          // ListFooterComponent={loading&&<ActivityIndicator size={"large"}/>}
          // ListEmptyComponent={<ActivityIndicator size={"small"}/>}
        />
      ) : null}
    </SafeAreaView>
  );
};

const style = {
  container: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  headerRightContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  ImageBox: {
    width: WPer90,
    height: WPer90,
    marginBottom: '5%',
    borderRadius: 8,
    backgroundColor: '#0575e6',
  },
};

export default withAppContext(Feed_SearchScrollScreen);
