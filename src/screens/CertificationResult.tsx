import React from 'react';
import { Icon, IconButton, List, Text } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from "@react-navigation/native-stack"
import type {RootStackParamListN} from './RootStackParamList'
import {SafeAreaView} from 'react-native'
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamListN, 'CertificationResult'>;

const GetGenderAndGetAge = (imp_uid:string) => {
  axios.post('http://13.124.209.97/firebase/createPushNotificationToMan', {
    imp_uid: imp_uid
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function CertificationResult({ route, navigation }: Props) {
  // const imp_success = route.params?.imp_success;
  const success = route.params?.success;
  const imp_uid = route.params?.imp_uid;
  const merchant_uid = route.params?.merchant_uid;
  const error_msg = route.params?.error_msg;
  console.log(route.params)
  // console.log(imp_success)
  console.log(success)
  console.log(imp_uid)
  // console.log(merchant_uid)
  console.log(error_msg)

  const isSuccess = !(
    // imp_success === 'false' ||
    // imp_success === false ||
    success === 'false' ||
    success === false
  );

  if(isSuccess == false){
    navigation.navigate("LoginScreen")
  }

  // imp_uid를 보내 성별, 나이를 가져오는 코드 
  // 미성년자 가입 불가능은 이미 이전 클라이언트에서 처리하였음.
  // 성별,나이를 얻어서 다음 스크린으로 보내기 

  if(isSuccess== true){
    GetGenderAndGetAge(imp_uid)
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        margin: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}
    >
      {isSuccess ? (
        <Icon
          as={FontAwesome}
          name={'check-circle'}
          size={20}
          color={'#52c41a'}
        />
      ) : (
        <Icon as={FontAwesome} name={'warning'} size={20} color={'#f5222d'} />
      )}
      <Text fontSize={25} fontWeight={'bold'} mb={20}>{`본인인증에 ${
        isSuccess ? '성공' : '실패'
      }하였습니다`}</Text>
      <List width={'90%'} mb={50} borderRadius={3}>
        <List.Item>
          <Text w={'40%'}>아임포트 번호</Text>
          <Text w={'60%'}>{imp_uid}</Text>
        </List.Item>
        {success ? (
          <List.Item>
            <Text w={'40%'}>주문번호</Text>
            <Text w={'60%'}>{merchant_uid}</Text>
          </List.Item>
        ) : (
          <List.Item>
            <Text w={'40%'}>에러메시지</Text>
            <Text w={'60%'}>{error_msg}</Text>
          </List.Item>
        )}
      </List>
      <IconButton
        icon={<Icon as={FontAwesome} name={'arrow-left'} size={20} />}
        /* @ts-ignore */
        onPress={() => navigation.navigate('MapScreen')}
      >
        <Text>돌아가기</Text>
      </IconButton>
    </SafeAreaView>
  );
}

export default CertificationResult;