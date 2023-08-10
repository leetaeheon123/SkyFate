import React from 'react';
import IMP from 'iamport-react-native';
import {getUserCode} from '../../UsefulFunctions/utils';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamListN} from '../RootStackParamList';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamListN, 'Certification'>;

function CertificationScreen({route, navigation}: Props) {
  const params = route.params?.params;

  console.log(params);
  const tierCode = route.params?.tierCode;
  const userCode = getUserCode('danal', tierCode, 'certification');
  console.log('userCode In CertificationScreen:', userCode);
  console.log('tierCode In CertificationScreen:', tierCode);

  // console.log(params!)
  // console.log(params)
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <IMP.Certification
        // userCode={userCode}
        userCode={'imp14466268'}
        // tierCode={tierCode}
        // data={params!}
        data={{
          carrier: '',
          company: '랑데부',
          m_redirect_url: 'http://detectchangingwebview/iamport/rn',
          merchant_uid: `mid_${new Date().getTime()}`,
          min_age: '20',
          name: '',
          phone: '',
        }}
        callback={(response) =>
          navigation.replace('CertificationResultScreen', {
            Certification: response,
            InvitationCodeSet: params,
          })
        }
      />
    </SafeAreaView>
  );
}

export default CertificationScreen;
