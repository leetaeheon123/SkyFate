export type RootStackParamList = {
    InvitationCodeSet: {
        InvitationCode: string
        Gender:string,
        PkNumber:number,
        imp_uid:string,
        NickName:string
    }
}
import type { IMPData } from 'iamport-react-native';

export interface CertificationParams {
    params: IMPData.CertificationData;
    tierCode?: string;
  }
  
  export interface PaymentParams {
    params: IMPData.PaymentData;
    tierCode?: string;
  }

export type RootStackParamListN = {
    Home: undefined;
    Certification: CertificationParams | undefined;
    CertificationTest: undefined;
    CertificationResult: any;
    Payment: PaymentParams | undefined;
    PaymentTest: undefined;
    PaymentResult: any;
  };