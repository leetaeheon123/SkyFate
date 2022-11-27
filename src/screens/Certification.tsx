import React from 'react';
import IMP from 'iamport-react-native';
import { getUserCode } from './utils';

import {NativeStackScreenProps} from "@react-navigation/native-stack"
import type {RootStackParamListN} from './RootStackParamList'
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamListN, 'Certification'>;

function Certification({ route, navigation }: Props) {
  const params = route.params?.params;
  const tierCode = route.params?.tierCode;
  const userCode = getUserCode('danal', tierCode, 'certification');
  const M_REDIRECT_URL = "http://detectchangingwebview/iamport/rn";

 

  // console.log(params!)
  // console.log(params)
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <IMP.Certification
        userCode={userCode}
        tierCode={tierCode}
        // data={params!}
        data={
          {
            "carrier": "", 
            "company": "아임포트", 
            "m_redirect_url": "http://detectchangingwebview/iamport/rn", 
            "merchant_uid": `mid_${new Date().getTime()}`, 
            "min_age": "20", 
            "name": "", 
            "phone": ""
          }
        }
        callback={(response) =>
          navigation.replace('CertificationResultScreen', response)
        }
      />
    </SafeAreaView>
  );
}

export default Certification;