

import React, { useState } from 'react';
import { IMPConst } from 'iamport-react-native';
import {
  FormControl,
  KeyboardAvoidingView,
} from 'native-base';
import { CARRIERS, TIER_CODES } from './constants';
import Picker from './Picker';
import {Platform, TextInput,Button,Text,ScrollView,SafeAreaView} from 'react-native'
import type {CertificationParams, RootStackParamListN} from './RootStackParamList'
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamListN, 'CertificationTest'>;


function CertificationTest({navigation}:Props) {
    const [merchantUid, setMerchantUid] = useState(`mid_${new Date().getTime()}`);
    const [company, setCompany] = useState('아임포트');
    const [carrier, setCarrier] = useState('MVNO');
    const [name, setName] = useState('이태헌');
    const [phone, setPhone] = useState('');
    const [minAge, setMinAge] = useState('');
    const [tierCode, setTierCode] = useState('');


    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 95 : undefined}
      >
        <ScrollView mx={1} backgroundColor={'#fff'}>
          <FormControl p={2} borderRadius={3}>
              <FormControl.Label my={1}>
                <Text>
                  주문번호
                </Text>
              </FormControl.Label>
              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={merchantUid}
                onChangeText={(value) => setMerchantUid(value)}>
              </TextInput>
              <FormControl.Label my={1}>
                <Text>
                  회사명
                </Text>
              </FormControl.Label>
              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={company}
                onChangeText={(value) => setCompany(value)}>
              </TextInput>
              <FormControl.Label my={1}>
                <Text>
                  통신사
                </Text>
              </FormControl.Label>
              {/* Carrier 배열값 참고 */}
              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={carrier}
                onChangeText={(value) => setCarrier(value)}>
              </TextInput>
              <FormControl.Label my={1}>
                <Text >
                  이름
                </Text>
              </FormControl.Label>

              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={name}
                onChangeText={(value) => setName(value)}>
              </TextInput>
            
              <FormControl.Label my={1}>
                <Text >
                  전화번호
                </Text>
              </FormControl.Label>
              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={phone}
                keyboardType="number-pad"
                returnKeyType={'done'}
                onChangeText={(value) => setPhone(value)}>
              </TextInput>
            
              <FormControl.Label my={1}>
                <Text>
                  최소연령
                </Text>
              </FormControl.Label>
              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={minAge}
                keyboardType="number-pad"
                returnKeyType={'done'}
                onChangeText={(value) => setMinAge(value)}>
              </TextInput>
              <FormControl.Label my={1}>
                <Text>
                  티어 코드
                </Text>
              </FormControl.Label>
              {/* TierCode 참고해서 적당한 나의 값 넣기. */}
              <TextInput 
                style={{width:200, height:40, borderWidth:1}}
                value={tierCode}
                onChangeText={(value) => setTierCode(value)} >
              </TextInput>
            <Button title="Helo"
              onPress={() => {
                const data :CertificationParams= {
                  params: {
                    merchant_uid: merchantUid,
                    company,
                    carrier,
                    name,
                    phone,
                    min_age: minAge,
                    m_redirect_url: IMPConst.M_REDIRECT_URL,
                  },
                  tierCode,
                };
                navigation.navigate("CertificationScreen", data)
              }}
            >
            </Button>
          </FormControl>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  
  export default CertificationTest;