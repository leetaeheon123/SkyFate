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
} from 'react-native';

import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {withAppContext} from '../../contextReducer';
import {GetEpochTime, MilisToMinutes} from '^/GetTime';
import styles from '~/ManToManBoard';

import {useQuery} from 'react-query';
import {Get_AllUser} from 'Firebase/get';
import {WPer45, WPer5} from '~/Per';

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

const Feed_MyWritingFeedScrollScreen = (props) => {
  const {route, navigation} = props;

  const {channel, UserData} = route.params;

  const {width} = Dimensions.get('window');

  const {data: UserList, isLoading: UserListisLoading} = useQuery(
    'UserListkey',
    () => Get_AllUser(1),
  );

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        key={item.ProfileImageurl}
        style={style.ImageBox}
        onPress={() => {
          navigation.navigate('DetailViewScreen', {
            UserData: UserData,
            OtherUserData: item,
            Type: 'Request',
          });
        }}>
        <Image
          style={style.ImageBox}
          source={{
            uri: item.ProfileImageurl,
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
    // else {
    //   return (
    //     <TouchableOpacity
    //       style={style.ImageBox}
    //       onPress={() => console.log('ProfileImageurl:', item.ProfileImageurl)}>
    //       <Text style={{color: 'white'}}>
    //         {item.ProfileImageurl}
    //         {typeof item.ProfileImageurl}
    //       </Text>
    //     </TouchableOpacity>
    //   );
    // }
  };

  return (
    <SafeAreaView style={style.container}>
      {UserListisLoading == false ? (
        <FlatList
          data={UserList} //렌더할 데이터
          renderItem={renderItem} //실제로 렌더될 컴포넌트
          keyExtractor={(item) => item.Uid}
          //없어도 작동은 되지만 미연의 에러방지를 위해 정의하는 것이 좋다.
          //keyExtractor는 반드시 String type이어야 한다.
          horizontal={false}
          bounces={true}
          numColumns={2}
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
    width: WPer45,
    height: WPer45,
    borderRadius: 10,
    marginLeft: '3.3%',
    marginBottom: '3.3%',
  },
};

export default withAppContext(Feed_MyWritingFeedScrollScreen);
