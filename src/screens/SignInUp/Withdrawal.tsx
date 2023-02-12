import React, {useContext, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {WithdrawalInFbAuth} from '^/FirebaseAuth';
import {DeleteInFbFirestore} from '^/Firebase';
import {AppContext} from '^/Appcontext';
import styles from '~/ManToManBoard';
import {Btn_ClickableBack, EmptyBox} from 'component/General';
import {
  WithdrawalCatSvg,
  WithdrawalTextSvg,
  탈퇴하기Svg,
} from 'component/Withdrawal/Withdrawal';
import {HPer15, HPer5, HPer8, WPer15} from '~/Per';
import {FSStyles, FWStyles} from '~/FontWeights';

import Modal from 'react-native-modal';
const WithdrawalScreen = ({route, navigation}: any) => {
  const {UserEmail, logout} = route.params;
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const DeleteUser = async () => {
    await WithdrawalInFbAuth(UserEmail, '123456');
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

  const WithdrawalAlert = () =>
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

  const [WithdrawalModalVis, setWithdrawalModalVis] = useState(false);

  const WithdrawalModal = (
    <Modal isVisible={WithdrawalModalVis}>
      <View
        style={[
          styles.Column_OnlyRowCenter,
          {
            width: '100%',
            height: 260,
            borderRadius: 20,
            backgroundColor: '#37375B',
          },
        ]}>
        <Text
          style={[
            {marginTop: 38},
            FWStyles.Semibold,
            FSStyles(20).General,
            styles.WhiteColor,
          ]}>
          회원탈퇴를 정말 진행하시겠습니까?
        </Text>
        <Text
          style={[
            {marginTop: 7, color: '#B5BAC0'},
            FWStyles.Light,
            FSStyles(16).General,
          ]}>
          {`탈퇴를 진행하면 사용중인 계정의 모든
정보가 삭제되고 복구가 불가능합니다.
또한, 5일동안 재가입이 불가능합니다.`}
        </Text>
        <Text
          style={[
            {marginTop: 33, color: '#B5BAC0'},
            FWStyles.Light,
            FSStyles(14).General,
          ]}>
          계정 삭제가 완료되면 앱이 재시작됩니다.
        </Text>

        <View
          style={[
            styles.W100,
            {
              height: 57,
              borderTopWidth: 0.5,
              borderTopColor: '#FFFFFF0a',
              position: 'absolute',
              bottom: 0,
            },
            styles.Row_OnlyFlex,
          ]}>
          <TouchableOpacity
            style={[
              styles.RowCenter,
              styles.W50,
              {borderRightWidth: 0.5, borderRightColor: '#FFFFFF0a'},
            ]}
            onPress={() => {
              setWithdrawalModalVis(false);
            }}>
            <Text style={[styles.WhiteColor]}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.RowCenter, styles.W50]}
            onPress={() => {}}>
            {탈퇴하기Svg}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView
      style={[
        styles.W100H100,
        styles.Column_OnlyRowCenter,
        {
          backgroundColor: '#37375B',
        },
      ]}>
      {WithdrawalModal}
      <View
        style={[
          styles.W100,
          styles.Row_OnlyColumnCenter,
          {
            height: '5%',
            justifyContent: 'space-between',
          },
        ]}>
        <Btn_ClickableBack
          width={17}
          onPress={() => navigation.goBack()}
          // style={{position: 'absolute', left: 12, top: 12}}
        />
        {WithdrawalTextSvg}
        {EmptyBox}
      </View>
      <WithdrawalCatSvg style={{marginTop: HPer15}}></WithdrawalCatSvg>
      <Text
        style={[
          FWStyles.Semibold,
          FSStyles(24).General,
          styles.WhiteColor,
          {marginTop: 30},
        ]}>
        회원탈퇴를 정말 진행하시겠어요?
      </Text>

      <Text
        numberOfLines={3}
        style={[
          FWStyles.Light,
          FSStyles(20).General,
          {marginTop: 11, color: '#B5BAC0'},
        ]}>
        {`탈퇴를 진행하면 사용중인 계정의 모든
정보가 삭제되고 복구가 불가능합니다.
또한, 5일동안 재가입이 불가능합니다.`}
      </Text>
      <TouchableOpacity
        style={[
          styles.RowCenter,
          {
            width: '73%',
            height: HPer5,
            backgroundColor: '#B5BAC014',
            borderRadius: 25,
            marginTop: HPer8,
          },
        ]}
        onPress={() => {
          // WithdrawalAlert();
          setWithdrawalModalVis(true);
        }}>
        <Text style={[styles.WhiteColor]}>회원탈퇴하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WithdrawalScreen;
