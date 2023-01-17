import React, {useContext} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {WithdrawalInFbAuth} from '^/FirebaseAuth';
import {DeleteInFbFirestore} from '^/Firebase';
import {AppContext} from '^/Appcontext';

const WithdrawalScreen = ({route, navigation}: any) => {
  const {UserEmail, logout} = route.params;
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const DeleteUser = async () => {
    await WithdrawalInFbAuth();
    await DeleteInFbFirestore('UserList', UserEmail);

    await WithdrawalInSendBird(UserEmail);
    logout(navigation, SendBird);
    // Async에서 삭제하는 로직
    // firestore UserList에서 삭제하는 로직
    // SendBird에서 유저 삭제하는 로직
  };

  const WithdrawalInSendBird = async (UserEmail: string) => {
    let requestOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Api-Token': '1522cd6e34542ab8c7542dd0200b69273c2af102',
      },
    };
    fetch(
      `https://api-B0BDC2B5-FF59-4D00-98C2-BADBAA9215E7.sendbird.com/v3/users/${UserEmail}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            '정말 회원탈퇴 하시겠습니까?', // 첫번째 text: 타이틀 제목
            '.', // 두번째 text: 그 밑에 작은 제목
            [
              // 버튼 배열
              {
                text: '아니요', // 버튼 제목
                onPress: () => console.log('아니라는데'), //onPress 이벤트시 콘솔창에 로그를 찍는다
                style: 'cancel',
              },
              {
                text: '네',
                onPress: () => {
                  DeleteUser();
                },
              }, //버튼 제목
              // 이벤트 발생시 로그를 찍는다
            ],
            {cancelable: false},
          );
        }}>
        <Text>회원탈퇴하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WithdrawalScreen;
