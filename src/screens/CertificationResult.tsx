import React from 'react';
import { Icon, IconButton, Text ,Button} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from "@react-navigation/native-stack"
import type {RootStackParamListN} from './RootStackParamList'
import {SafeAreaView} from 'react-native'
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamListN, 'CertificationResult'>;

// const GetGenderAndGetAge = async (imp_uid:string) => {
//   await axios.post('http://13.124.209.97/firebase/createPushNotificationToMan', {
//     imp_uid: imp_uid
//   })
//   .then((response) =>{
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }

const GotoRegisterScreen = async (navigation:any, imp_uid:string, InvitationCodeSet:Object) =>{

  navigation.navigate('RegisterScreen', InvitationCodeSet)
}

function CertificationResult({ route, navigation }: Props) {
  // const imp_success = route.params?.imp_success;
  const success = route.params?.Certification.success;
  const imp_uid = route.params?.Certification.imp_uid;
  const merchant_uid = route.params?.Certification.merchant_uid;
  const error_msg = route.params?.Certification.error_msg;
  console.log('merchant_uid',merchant_uid)
  const InvitationCodeSet = route.params?.InvitationCodeSet


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

  // if(isSuccess == false){
  //   navigation.navigate("LoginScreen")
  // }

  // imp_uid를 보내 성별, 나이를 가져오는 코드 
  // 미성년자 가입 불가능은 이미 이전 클라이언트에서 처리하였음.
  // 성별,나이를 얻어서 다음 스크린으로 보내기 

  // if(isSuccess== true){
  //   GetGenderAndGetAge(imp_uid)
  // }
  
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
      <Text fontSize={25} fontWeight={'bold'} mb={20}>{`본인인증에 
      ${isSuccess ? '성공' : '실패'}
        하였습니다`}</Text>
        <Text>아임포트 번호 {imp_uid}</Text>
        {success ? (
          <Text>ㅇㅇ</Text>
        ) : (
          <Text>에러메시지 {error_msg}</Text>
        )}
     {isSuccess ? 
       <IconButton
       icon={<Icon as={FontAwesome} name={'arrow-left'} size={20} />}
       /* @ts-ignore */
       onPress={() => 
        GotoRegisterScreen(navigation, imp_uid, InvitationCodeSet)
        }
     >
       <Text>회원가입 화면으로 이동하기</Text>
     </IconButton>
     :
      <Button
        onPress={()=>{
          navigation.navigate("ValidInvitationCodeScreen")
        }}>
        다시 로그인 화면으로
      </Button>
     }
   
    </SafeAreaView>
  );
}

export default CertificationResult;