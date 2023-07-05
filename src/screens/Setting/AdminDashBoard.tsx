import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Get_AiSuccessUserListByAdmin,
  Get_NotCheckSuccessUserListByAdmin,
  Get_UserListAiByAdmin,
  Get_WaitAiUserListAiByAdmin,
} from '../../Firebase/get';
import {RequestAttendFirstEvent} from '../../Firebase/create';
import {UpdateUserAttendFirstEvent} from '../../Firebase/update';

function AdminDashBoardScreen() {
  const [UserList, setUserList] = useState([]);
  const [UserAiWaitList, setAiWaitUserList] = useState([]);
  const [UserAiSuccessList, setAiSuccessUserList] = useState([]);
  const [UserAiNotCheckSuccessList, setAiNotCheckSuccessUserList] = useState(
    [],
  );

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
  }, [Reload]);

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

        <Text
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
          : null}
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
                <View
                  key={data.UserEmail}
                  style={{
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: 'black',
                    borderStyle: 'solid',
                    width: '90%',
                    marginLeft: '5%',
                    padding: 10,
                  }}>
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

export default AdminDashBoardScreen;
