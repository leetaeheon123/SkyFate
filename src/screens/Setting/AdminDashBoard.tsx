import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Get_AiSuccessUserListByAdmin,
  Get_EventAttendedUserDataList,
  Get_NotCheckSuccessUserListByAdmin,
  Get_UserListAiByACDGKU,
  Get_UserListAiByAdmin,
  Get_WaitAiUserListAiByAdmin,
} from '../../Firebase/get';
import {
  RequestAttendFirstEvent,
  RequestAttendFirstEventBackUp,
} from '../../Firebase/create';
import {UpdateUserAttendFirstEvent} from '../../Firebase/update';
import {ChangeVisualMeasureOneUser} from '../../Firebase/update/User';
import {WPer100, WPer50, WPer90} from '~/Per';
import styles from '~/ManToManBoard';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {NotCheckFailed, NotCheckSuccess} from '^/NoMistakeWord';

function AdminDashBoardScreen() {
  const [UserList, setUserList] = useState([]);
  const [UserAiWaitList, setAiWaitUserList] = useState([]);
  const [UserAiSuccessList, setAiSuccessUserList] = useState([]);
  const [UserAiNotCheckSuccessList, setAiNotCheckSuccessUserList] = useState(
    [],
  );
  const [ACDGKULen, setACDGKULen] = useState(0);

  const [Reload, setReload] = useState(false);

  useEffect(() => {
    Get_UserListAiByAdmin().then((Result) => {
      setUserList(Result);
    });
    Get_WaitAiUserListAiByAdmin().then((Result) => {
      setAiWaitUserList(Result);
    });
    Get_AiSuccessUserListByAdmin().then((Result) => {
      setAiSuccessUserList(Result);
    });
    Get_NotCheckSuccessUserListByAdmin().then((Result) => {
      setAiNotCheckSuccessUserList(Result);
    });
    Get_UserListAiByACDGKU().then((Result) => {
      setACDGKULen(Result);
    });
  }, [Reload]);

  const Backup = () => {
    Get_EventAttendedUserDataList(2).then((Result) => {
      console.log(Result);

      Result.map((data, index) => {
        RequestAttendFirstEventBackUp(data);
      });
    });
  };

  const MainImageFlat = ({Image1, Image2}: any) => {
    let FiliterImageArray = [Image1, Image2];
    return (
      <View
        style={{
          width: '100%',
          height: WPer100,
        }}>
        <SwiperFlatList
          showPagination={true}
          data={FiliterImageArray}
          paginationStyle={{
            width: '70%',
            bottom: 2.5,
            display: 'flex',
            flexDirection: 'row',
          }}
          paginationStyleItem={{
            height: '100%',
            width: `${100 / FiliterImageArray.length}%`,
            backgroundColor: '#00000014',
            borderRadius: 4,
          }}
          paginationStyleItemActive={{
            height: '100%',
            width: `${100 / FiliterImageArray.length}%`,
            backgroundColor: 'white',
            borderRadius: 4,
          }}
          renderItem={({item}) => (
            <Image
              resizeMode="cover"
              style={{
                width: WPer100,
                height: WPer100,
                borderRadius: 31,
              }}
              source={{
                uri: item,
              }}
            />
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'yellow',
          position: 'absolute',
          top: 100,
          right: 30,
          zIndex: 2,
        }}
        onPress={() => {
          setReload(!Reload);
        }}>
        <Text>리로딩</Text>
      </TouchableOpacity>
      <ScrollView>
        <TouchableOpacity>
          <Text>파티에 참석 시키기</Text>
        </TouchableOpacity>

        <Text style={{fontSize: 30, color: 'red'}}>
          ACDGKU Len: {ACDGKULen}
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 30,
          }}
          onPress={() => {
            Backup();
          }}>
          <Text
            style={{
              fontSize: 24,
            }}>
            Backup
          </Text>
        </TouchableOpacity>

        {/* <Text
          style={{
            color: 'red',
            fontSize: 24,
          }}>
          Influence
        </Text>
        {UserList.length != 0
          ? UserList.map((data, index) => {
              return (
                <View
                  key={data.UserEmail}
                  style={{
                    marginBottom: 20,
                  }}>
                  <Text>닉네임:{data?.NickName}</Text>
                  <Text>메일:{data?.UserEmail}</Text>
                  <Text>측정상태:{data?.VisualMeasureStatus}</Text>
                  <Text>사진1:{data?.ProfileImageUrl}</Text>
                  <Text>사진2:{data?.ProfileImageUrl2}</Text>
                </View>
              );
            })
          : null} */}
        <Text
          style={{
            color: 'red',
            fontSize: 24,
          }}>
          AiWait
        </Text>

        {UserAiWaitList.length != 0
          ? UserAiWaitList.map((data, index) => {
              return (
                <View key={data.UserEmail} style={AdminDashBoard.Container}>
                  <Text>닉네임:{data?.NickName}</Text>
                  <Text>메일:{data?.UserEmail}</Text>
                  <Text>측정상태:{data?.VisualMeasureStatus}</Text>
                  {!data?.ProfileImageUrl == false ? (
                    <MainImageFlat
                      Image1={data?.ProfileImageUrl}
                      Image2={data?.ProfileImageUrl2}></MainImageFlat>
                  ) : null}

                  {/* <TouchableOpacity
                    style={{backgroundColor: 'red'}}
                    onPress={() => {
                      RequestAttendFirstEvent(data);
                    }}>
                    <Text>파티 참석시키기</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{backgroundColor: 'red', marginTop: 30, width: 200}}
                    onPress={() => {
                      ChangeVisualMeasureOneUser(
                        data?.UserEmail,
                        NotCheckSuccess,
                      );
                    }}>
                    <Text>Ai NotCheckSuccess로 변경</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: 'red', marginTop: 30, width: 200}}
                    onPress={() => {
                      ChangeVisualMeasureOneUser(
                        data?.UserEmail,
                        NotCheckFailed,
                      );
                    }}>
                    <Text>Ai NotCheckFailed 변경</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          : null}

        {UserAiNotCheckSuccessList.length != 0 ? (
          <>
            <Text
              style={{
                color: 'orange',
                fontSize: 24,
                fontWeight: 'bold',
              }}>
              AiNotCheckSucess
            </Text>
            <Text style={Font.Len}>
              총 수: {UserAiNotCheckSuccessList.length}
            </Text>
            {UserAiNotCheckSuccessList.map((data, index) => {
              return (
                <View
                  key={data.UserEmail}
                  style={{
                    marginBottom: 20,
                  }}>
                  <Text>닉네임:{data?.NickName}</Text>
                  <Text>메일:{data?.UserEmail}</Text>
                  <Text>측정상태:{data?.VisualMeasureStatus}</Text>
                  <Text>사진1:{data?.ProfileImageUrl}</Text>
                  <Text>사진2:{data?.ProfileImageUrl2}</Text>
                  <TouchableOpacity
                    style={{backgroundColor: 'red'}}
                    onPress={() => {
                      RequestAttendFirstEvent(data);
                    }}>
                    <Text>파티 참석시키기</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        ) : null}

        <Text
          style={{
            color: 'blue',
            fontSize: 24,
          }}>
          AiSucess
        </Text>
        <Text style={Font.Len}>총 수: {UserAiSuccessList.length}</Text>

        {UserAiSuccessList.length != 0
          ? UserAiSuccessList.map((data, index) => {
              return (
                <View key={data.UserEmail} style={AdminDashBoard.Container}>
                  <Text>닉네임:{data?.NickName}</Text>
                  <Text>메일:{data?.UserEmail}</Text>
                  <Text>측정상태:{data?.VisualMeasureStatus}</Text>
                  <Text>사진1:{data?.ProfileImageUrl}</Text>
                  <Text>사진2:{data?.ProfileImageUrl2}</Text>
                  <Text
                    style={{
                      color: data?.FTAttend ? 'blue' : 'red',
                      backgroundColor: 'white',
                      marginBottom: 20,
                    }}>
                    앱파티참석 여부:{data?.FTAttend ? '참석' : '아직 미참'}
                  </Text>
                  <TouchableOpacity
                    style={{backgroundColor: 'red'}}
                    onPress={() => {
                      RequestAttendFirstEvent(data);
                    }}>
                    <Text>파티 참석시키기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: 'red', marginTop: 20}}
                    onPress={() => {
                      UpdateUserAttendFirstEvent(data.UserEmail);
                    }}>
                    <Text>FTAttend True로 추가시키기</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const Font = StyleSheet.create({
  Title: {},
  Len: {
    color: 'red',
    fontWeight: '700',
  },
});
const AdminDashBoard = StyleSheet.create({
  Container: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    width: '90%',
    marginLeft: '5%',
    padding: 10,
  },
});

export default AdminDashBoardScreen;
