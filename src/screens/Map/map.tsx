import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useReducer,
} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  PermissionsAndroid,
  Image,
  Dimensions,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  AppState,
  FlatList,
  RefreshControl,
  Switch,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';

import {MapScreenStyles} from '~/MapScreen';

import styles from '~/ManToManBoard';

import {useQuery} from 'react-query';

import {firebase} from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';

import MapView, {LocalTile, Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import firestore from '@react-native-firebase/firestore';

import PushNotificationIOS from '@react-native-community/push-notification-ios';

import {fcmService} from '../../UsefulFunctions/push.fcm';
import {localNotificationService} from '../../UsefulFunctions/push.noti';
import axios from 'axios';

import MarkerAnimationStyles from '~/MarkerAnimation';
import Ring from '../Ring/Ring';
import OtherRing from '../Ring/OtherRing';

import AsyncStorage from '@react-native-community/async-storage';
import * as Progress from 'react-native-progress';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import {Get_itaewon_HotPlaceList} from '../../UsefulFunctions/HotPlaceList';

import {AppContext} from '../../UsefulFunctions//Appcontext';

import {withAppContext} from '../../contextReducer';
import {isEmptyObj, OddNumValid} from '../../UsefulFunctions/isEmptyObj';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

import {GetEpochTime} from '../../../src/UsefulFunctions/GetTime';
import {locationReducer} from 'reducer/location';
import {ReplacedotInEmail} from '^/Replace';

import {ChangeMyProfileImage} from '^/ImageUpload';
import {
  Enter_MatchSvg,
  ClickedEnter_MatchSvg,
  GeneralMatchSvg,
  RandomMatchSvg,
  Enter_ChatSvg,
  Enter_SettingSvg,
  Enter_FriendMapSvg,
  M3TopSvg,
  M3Main_TopBarSvg,
  OnSvg,
  OffSvg,
  OnToggleSvg,
  OffToggleSvg,
} from 'component/Map/MapSvg';

import {
  CheckSvg,
  ClickedCheckSvg,
  ClickedCompleteSvg,
  ColorPeopleSvg,
  MemoSvg,
  MinusSvg,
  PaySvg,
  PeopleAddSvg,
  PeopleSvg,
  PlusSvg,
} from 'component/General/GeneralSvg';
import {M5ChatSvg} from 'component/Chat/ChatSvg';
import {Type2VerticalLine} from 'component/LinearGradient/LinearGradientCircle';
import LinearGradient from 'react-native-linear-gradient';
import {Type2가로, Type2세로} from 'component/LinearGradient/LinearType';
import Swiper from 'react-native-swiper';
import GradientText from 'component/GradientText';
import {GetFriendProfileImage, GetUserNickNameList} from '^/Firebase';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';

export interface ILocation {
  latitude: number;
  longitude: number;
}

interface ProfileForGtoM {
  ProfileImageUrl: string;
  ProfileImageUrl2: string;
  ProfileImageUrl3: string;
  ProfileImageUrl4: string;
  ProfileImageUrl5: string;
  ProfileImageUrl6: string;
  FriendProfileImageUrl: string;
  FriendProfileImageUrl2: string;
  FriendMbti: string;
  FriendNickName: string;
  UserEmail: string;
  Memo: string;
  PeopleNum: number;
  CanPayit: string;
  NickName: string;
  latitude: Number;
  longitude: Number;
  Mbti: string;
}

export const reference = firebase
  .app()
  .database(
    'https://hunt-d7d89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );

// 여성유저가 위치 공유시 남성 유저분들에게 알람을 보내는 기능
const SendPushToMans = () => {
  axios
    .post('http://13.124.209.97/firebase/createPushNotificationToMan/uid', {})
    .then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      // console.log(error);
    });
};

const Get_GirlsLocation = () => {
  const databaseDirectory = `/Location`;
  return reference
    .ref(databaseDirectory)
    .once('value')
    .then((snapshot) => {
      let ObjValue = snapshot.val();
      const target = Object.values(ObjValue);
      return target;
    })
    .then((AllLocationData) => {
      return AllLocationData;
    });
};

const Get_MansLocations = () => {
  const databaseDirectory = `/ManLocation`;
  return reference
    .ref(databaseDirectory)
    .once('value')
    .then((snapshot) => {
      let val = snapshot.val();
      const target = Object.values(val);
      return target;
    })
    .then((AllLocationData) => {
      return AllLocationData;
    });
};

const Get_GangNam_HotPlaceList = () => {
  const databaseDirectory = `/HotPlaceList/GangNam`;
  return reference
    .ref(databaseDirectory)
    .once('value')
    .then((snapshot) => {
      let val = snapshot.val();
      const target = Object.values(val);
      return target;
    })
    .then((AllLocationData) => {
      return AllLocationData;
    });
};

const Get_Sinsa_HotPlaceList = () => {
  const databaseDirectory = `/HotPlaceList/Sinsa`;
  return reference
    .ref(databaseDirectory)
    .once('value')
    .then((snapshot) => {
      let val = snapshot.val();
      const target = Object.values(val);
      return target;
    })
    .then((AllLocationData) => {
      return AllLocationData;
    });
};

const RequestLocationPermissionsAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('you can use the location');
    } else {
      // console.log('Location Permission denied');
    }
  } catch (err) {
    // console.log(err);
  }
};

const GetLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('always');
  } else {
    await RequestLocationPermissionsAndroid();
  }
};

function Counter(callback: Function, delay: number | null, Reset: Function) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else if (delay == null) {
      Reset();
    }
  }, [delay]);
}

export const GetMyCoords = async (
  callback: Function,
  errstring: String,
  successtring: string = '',
) => {
  return Geolocation.getCurrentPosition(
    async (position) => {
      try {
        const {latitude, longitude} = position.coords;
        callback(latitude, longitude);
        // console.log(successtring);
      } catch (err) {
        // console.log('error:', err.message);
        // console.log(`${errstring}`);
      }
    },
    (error) => {
      // console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 300000, maximumAge: 10000},
  );
};

const ShowManLocationForGM = async (
  UserEmail: string,
  ProfileImageUrl: string,
  ProfileImageUrl2: string,
  ProfileImageUrl3: string,
  ProfileImageUrl4: string,
  ProfileImageUrl5: string,
  ProfileImageUrl6: string,
  NickName: string,
  Mbti: string,
) => {
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  let id = setInterval(() => {
    const EpochTime = +new Date();

    const UpdateManLocation = (latitude: any, longitude: any) => {
      reference.ref(`/ManLocation/${ReplaceUserEmail}`).update({
        UserEmail: UserEmail,
        latitude: latitude,
        longitude: longitude,
        ProfileImageUrl: ProfileImageUrl,
        ProfileImageUrl2: ProfileImageUrl2,
        ProfileImageUrl3: ProfileImageUrl3,
        ProfileImageUrl4: ProfileImageUrl4,
        ProfileImageUrl5: ProfileImageUrl5,
        ProfileImageUrl6: ProfileImageUrl6,
        FriendProfileImageUrl: '',
        FriendProfileImageUrl2: '',
        FriendMbti: '',
        FriendNickName: '',

        TimeStamp: EpochTime,
        NickName: NickName,
        Mbti: Mbti,
      });
    };

    GetMyCoords(
      UpdateManLocation,
      'ManLocationUdpate Function',
      'ManLocationForeGroundUpdate',
    );
  }, 20000);

  return id;
};

const DeleteMyLocationAfter3Min = (UserEmail: string, Gender: number) => {
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  if (Gender == 2) {
    setTimeout(() => {
      reference.ref(`/Location/${ReplaceUserEmail}`).remove();
    }, 180000);
  }
  // } else if(Gender == 1){
  //   // console.log("Man")
  // }
};

const DirectDeleteMyLocation = (UserEmail: string) => {
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  reference.ref(`/Location/${ReplaceUserEmail}`).remove();
};

// 여성유저가 자신의 위치를 3분동안 공유하기 시작하는 코드
const Girl_StartShowLocation = async (
  UserEmail: string,
  Memo: string = '',
  PeopleNum: Number,
  FriendEmail: string = '',
  CanPayit: Number,
  ProfileImageUrl: string,
  ProfileImageUrl2: string,
  ProfileImageUrl3: string,
  ProfileImageUrl4: string,
  ProfileImageUrl5: string,
  ProfileImageUrl6: string,
  NickName: string,
  Mbti: string,
) => {
  let CanPayStr: string;
  if (CanPayit == 1) {
    CanPayStr = '보고결정';
  } else if (CanPayit == 2) {
    CanPayStr = 'O';
  } else if (CanPayit == 3) {
    CanPayStr = 'X';
  }

  // const CanPayObj = {
  //   1: '보고결정',
  //   2: 'O',
  //   3: 'X'
  // }
  // const CanPayStr:string = CanPayObj.CanPayit

  const FriendData: Object = await GetFriendProfileImage(FriendEmail);
  // console.log('FriendData [MapScreen]', FriendData);

  const FriendProfileImageUrl = FriendData.ProfileImageUrl;
  const FriendProfileImageUrl2 = FriendData.ProfileImageUrl2;

  const FriendNickName = FriendData?.NickName;
  const FriendMbti = FriendData?.Mbti;

  const EpochTime = GetEpochTime();
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  // 현재 위치를 db에 업데이트시키는 코드

  const UpdateGirlLocation = (latitude: number, longitude: number) => {
    reference
      .ref(`/Location/${ReplaceUserEmail}`)
      .update({
        latitude: latitude,
        longitude: longitude,
        Memo: Memo,
        CanPayit: CanPayStr,
        PeopleNum: PeopleNum,
        ProfileImageUrl: ProfileImageUrl,
        ProfileImageUrl2: ProfileImageUrl2,
        ProfileImageUrl3: ProfileImageUrl3,
        ProfileImageUrl4: ProfileImageUrl4,
        ProfileImageUrl5: ProfileImageUrl5,
        ProfileImageUrl6: ProfileImageUrl6,
        FriendProfileImageUrl: FriendProfileImageUrl,
        FriendProfileImageUrl2: FriendProfileImageUrl2,
        FriendMbti: FriendMbti,
        FriendNickName: FriendNickName,
        TimeStamp: EpochTime,
        UserEmail: UserEmail,
        NickName: NickName,
        Mbti: Mbti,
      })
      .then(() => DeleteMyLocationAfter3Min(ReplaceUserEmail, 2));
  };

  GetMyCoords(UpdateGirlLocation, 'Girl_StartShowLocation Function');
};
export const logout = (navigation: any, SendBird: any) => {
  RemoveIdentityToken();
  SendBird.disconnect();
  navigation.navigate('ValidInvitationCodeScreen');
};
export const RemoveIdentityToken = async () => {
  AsyncStorage.removeItem('UserEmail');
};
// foreground에서 푸쉬알림 보기 테스트
function SendPushNotificationInforeground() {
  PushNotificationIOS.addNotificationRequest({
    id: '123',
    title: 'hello',
    body: 'hi',
    subtitle: 'hh',
  });
}

const AndroidPushNoti = () => {
  // console.log('AndroidPushNoti');

  localNotificationService.showNotification(1, 'title', 'body', {}, {});
};

// 여자이면 남자위치데이터 불러와서 지도에 보여주는 로직 추가하기
// 자주 바뀌는 데이터이므로 State화 하기

export const UpdateMyLocationWatch = (
  // setLocation: Function,
  dispatch: any,
  UpdateMyLocation: Function = Function(),
) => {
  const _watchId = Geolocation.watchPosition(
    (position) => {
      const {latitude, longitude} = position.coords;
      // setLocation({latitude, longitude});
      dispatch({type: 'update', payload: {latitude, longitude}});
      UpdateMyLocation(latitude, longitude);
      // console.log('state location change');
    },
    (error) => {
      // console.log(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 50,
      interval: 5000,
      fastestInterval: 500,
    },
  );

  return () => {
    if (_watchId) {
      Geolocation.clearWatch(_watchId);
    }
  };
};

const MapScreen = (props: any) => {
  const LOCATION_DELTA = {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const UserData = props.route.params.CurrentUser;
  const navigation = useNavigation();

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const [ProfileImageUrl, setProfileImageUrl] = useState(
    UserData.ProfileImageUrl,
  );
  const {width, height} = Dimensions.get('window');

  const H11 = height * 0.11;
  const mapRef = useRef(null);

  const [location, setLocation] = useState<ILocation | undefined>(undefined);

  const [InvitationCodeToFriend, setInvitationCodeToFriend] = useState([]);

  const GetInvitationToFriendObj = async (
    InvitationCodeToFriend: Array<string>,
  ) => {
    let Array: Array<Object> = [];
    await firestore()
      .collection('InvitationCodeList')
      .where('InvitationCode', '==', InvitationCodeToFriend[0])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let Obj = {
            InvitationCode: InvitationCodeToFriend[0],
            Used: doc.data().Used,
          };
          Array.push(Obj);
        });
      });

    await firestore()
      .collection('InvitationCodeList')
      .where('InvitationCode', '==', InvitationCodeToFriend[1])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let Obj = {
            InvitationCode: InvitationCodeToFriend[1],
            Used: doc.data().Used,
          };

          Array.push(Obj);
        });
      });
    return Array;
  };
  const GetInvitationToFriendCode = async (PkNumber: string) => {
    firestore()
      .collection(`InvitationCodeList`)
      .doc(String(PkNumber))
      .get()
      .then(async (doc) => {
        const Result = doc.data();
        const InvitationCodeToFriend = Result?.InvitationCodeToFriend;
        let InviObj: Array<Object> = await GetInvitationToFriendObj(
          InvitationCodeToFriend,
        );
        // console.log('InviObj:', InviObj);

        return InviObj;
      })
      .then((InvitationCodeToFriend) => {
        // console.log('InvitationCodeToFriend:', InvitationCodeToFriend);

        setInvitationCodeToFriend(InvitationCodeToFriend);
      });
  };

  const [NickNameList, setNickNameList] =
    useState<TAutocompleteDropdownItem[]>();

  const [locationState, locationdispatch] = useReducer(locationReducer, {
    latlng: {},
  });

  const [token, setToken] = useState('');

  const onRegister = (tk: string) => {
    // console.log('[App] onRegister : token :', tk);
    if (tk) setToken(tk);
  };
  // notify를 인수로 받아
  // notify의 title, body, notify를
  const onNotification = (notify: any) => {
    // console.log('[App] onNotification : notify :', notify);

    const options = {
      soundName: 'default',
      playSound: true,
    };

    localNotificationService.showNotification(
      0,
      notify.title,
      notify.body,
      notify,
      options,
    );
  };

  const onOpenNotification = (notify: any) => {
    // console.log('[App] onOpenNotification : notify :', notify);
    Alert.alert('누군가가 위치 공유를 시작했습니다!');
    // Alert.alert('Open Notification : notify.body :'+ );
  };

  const [AsyncEmail, setAsyncEmail] = useState('');

  const GetAsyncStorageEmail = async () => {
    let AsyncStorageEmail = await AsyncStorage.getItem('UserEmail');
    setAsyncEmail(AsyncStorageEmail);
  };

  const SetMyLocation = (latitude: number, longitude: number) => {
    setLocation({latitude, longitude});
  };

  useEffect(() => {
    async function SaveInDevice() {
      // 로케이션 위치 가져오는 권한설정
      await GetLocationPermission();
      await GetMyCoords(
        SetMyLocation,
        'SetMyLocation Function In MapScreen',
        'Success SetMyLocation',
      );

      const locaidw = (latitude: number, longitude: number) => {
        locationdispatch({type: 'update', payload: {latitude, longitude}});
      };
      await GetMyCoords(
        locaidw,
        'SetMyLocation Reducer Error Function In MapScreen',
        'Success SetMyLocation Reducer',
      );

      await GetUserNickNameList(UserData.Gender, setNickNameList);
      // 현재위치를 state화 &추적

      // UpdateMyLocationWatch(setLocation, locationdispatch);
      UpdateMyLocationWatch(locationdispatch);

      if (UserData.Gender == '1') {
        let Result = ShowManLocationForGM(
          UserData.UserEmail,
          UserData.ProfileImageUrl,
          UserData.ProfileImageUrl2,
          UserData.ProfileImageUrl3,
          UserData.ProfileImageUrl4,
          UserData.ProfileImageUrl5,
          UserData.ProfileImageUrl6,
          UserData.NickName,
          UserData.Mbti,
        );
        return Result;
      }
      await GetInvitationToFriendCode(UserData.PkNumber);
      await GetAsyncStorageEmail();
    }

    let Result = SaveInDevice();

    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    // CheckL1();

    const onChildAdd = reference
      .ref('/Location')
      .on('child_added', (snapshot) => {
        GirlsLocationsrefetch();
      });

    const onChildRemove = database()
      .ref('/Location')
      .on('child_removed', (snapshot) => {
        // console.log(snapshot);
        GirlsLocationsrefetch();
      });

    const ManonChildAdd = database()
      .ref('/ManLocation')
      .on('child_added', (snapshot) => {
        MansLocationsretech();
      });

    // // console.log("AppState In MapScreen:", AppState.currentState)
    // // console.log("appState.current", appState.current);

    // const subscription = AppState.addEventListener("change", (nextAppState) => {
    //   if (
    //     appState.current.match(/inactive|background/) &&
    //     nextAppState === "active"
    //   ) {
    //     // // console.log("appState.current2",appState.current)
    //     // console.log("App has come to the foreground!");
    //   } else if(appState.current.match(/active/) && nextAppState === "background") {
    //     // console.log("App has come to the background")
    //     // SendBird.disconnect()
    //   }
    //     appState.current = nextAppState;
    //     // console.log("AppState", nextAppState);

    //   })

    // const unsubscribe = AppState.addEventListener('change', handleStateChange);

    // Stop listening for updates when no longer required
    return () => {
      reference.ref('/Location').off('child_added', onChildAdd);
      reference.ref('/ManLocation').off('child_added', ManonChildAdd);
      reference.ref('/Location').off('child_moved', onChildRemove);

      // unsubscribe.remove();
      // clearInterval(Result)
      // unsubscribe.remove();
      // subscription.remove();
    };
  }, []);

  /// on connection event

  const handleStateChange = (newState: any) => {
    // ios - active - inactive
    // aos - active - background니
    // active를 기준으로 나눠주면 나누면 두 운영체제 모두 포함하는 코드가 된다.
    // console.log('handleStateChange');
    if (newState === 'active') {
      SendBird.setForegroundState();
    } else {
      SendBird.setBackgroundState();
    }
  };

  const StopShowMyLocation = () => {
    setGpsOn((previousState) => !previousState);
    setSecond(180);
    DirectDeleteMyLocation(UserData.UserEmail);
  };

  const ChangeShowStateMan = () => {
    setGpsOn((previousState) => !previousState);
  };

  const [GpsOn, setGpsOn] = useState(UserData.Gender == 1);

  const [ModalVisiable, setModalVisiable] = useState(false);
  const [ProfileModalVisiable, setProfileModalVisiable] = useState(false);
  const [ShowUserModal, setShowUserModal] = useState(false);

  const [ProfileForGtoM, setProfileForGtoM] = useState<Object>({});

  const [Memo, setMemo] = useState('');
  const [FriendEmail, setFriendEmail] = useState<string>('');
  const [PeopleNum, setPeopleNum] = useState(2);
  const [MoenyRadioBox, setMoneyRadioBox] = useState(0);

  const [second, setSecond] = useState<number>(180);

  const ChangeModalVisiable = () => {
    setModalVisiable((previousState) => !previousState);
  };

  Counter(
    () => {
      if (GpsOn == true) {
        setSecond(second - 1);
      }
    },
    second >= 1 ? 1000 : null,
    () => {
      setSecond(180);
      setGpsOn(false);
    },
  );

  const ShowMyLocation = () => {
    const date = new Date();
    let day = date.getHours();
    day = 23;
    // console.log(day);
    // day가 오후 10시 ~ 새벽 7시
    if ((day >= 22 && day <= 24) || (day >= 1 && day <= 7)) {
      Girl_StartShowLocation(
        UserData.UserEmail,
        Memo,
        PeopleNum,
        FriendEmail,
        MoenyRadioBox,
        UserData.ProfileImageUrl,
        UserData.ProfileImageUrl2,
        UserData.ProfileImageUrl3,
        UserData.ProfileImageUrl4,
        UserData.ProfileImageUrl5,
        UserData.ProfileImageUrl6,
        UserData.NickName,
        UserData.Mbti,
      );
      setGpsOn(true);
      ChangeModalVisiable();
    } else {
      Alert.alert('10시부터 새벽7시까지 이용 가능합니다.');
    }
  };

  const SwitchShowUserModal = () => {
    setShowUserModal(!ShowUserModal);
  };

  const [ShowMbti, setShowMbti] = useState('');
  const [ShowNickName, setShowNickName] = useState('');

  const Stateize = async (Obj: ProfileForGtoM) => {
    setProfileForGtoM(Obj);
    // setShowMbti(Obj.Mbti);
    // setShowNickName(Obj.NickName);

    // console.log('stateize');
  };

  const GirlMarkerOnPress = async (Obj: ProfileForGtoM) => {
    await Stateize(Obj);
    SwitchShowUserModal();
  };

  const DeleteChannelAfter10Minutes = (Channel: Object) => {
    // console.log('ChannelUrl In DeleteChannelAfter10Minutes:', Channel.url);
    UploadChannelUrlInDb(Channel.url);
    ChannelDeleteTimer(Channel);
  };

  const UploadChannelUrlInDb = (ChannelUrl: string) => {
    reference.ref(`/ChatingList/${ChannelUrl}`).update({
      ChannelUrl: ChannelUrl,
      CreateAt: Date.now(),
    });
  };

  const ChannelDeleteTimer = (channel: Object) => {
    // setTimeout(() => {
    //   navigation.navigate('IndicatorScreen', {
    //     action: 'deleteInClient',
    //     data: {channel},
    //   });
    // }, 2000);
    // setTimeout(() => {
    //   Channel.delete()
    // }, 600000);
  };

  const CreateChating = () => {
    // console.log('StartChatingBetweenGirls In TwoMapScreen');
    let params = new SendBird.GroupChannelParams();

    // 추가로 고려할거 : 이미 채팅하기를 눌러 채팅방이 생성된 상태와 처음 채팅하기를 눌러서 채팅방이 생성되는 상황을 분기처리 하기
    if (isEmptyObj(ProfileForGtoM) == false) {
      let Member = [ProfileForGtoM.UserEmail, UserData.UserEmail];
      let NickNames = [ProfileForGtoM.NickName, UserData.NickName];

      const Latlng = {
        latitude: ProfileForGtoM.latitude,
        longitude: ProfileForGtoM.longitude,
      };

      params.addUserIds(Member);
      params.coverUrl = ProfileForGtoM.ProfileImageUrl;
      params.name = NickNames[0];
      params.operatorUserIds = Member;
      (params.isDistinct = true), (params.isPublic = false);
      const OtherMetadDataKey = 'CanSendL1Invite_' + Member[0];
      const MyMetadDataKey = 'CanSendL1Invite_' + Member[1];

      SendBird.GroupChannel.createChannel(
        params,
        function (groupChannel: any, error: Error) {
          if (error) {
            // console.log(error.message);
            // Handle error.
          } else if (!error) {
            SwitchShowUserModal();
            CreateCanSendMetaData(
              groupChannel,
              OtherMetadDataKey,
              MyMetadDataKey,
            );
            chat(groupChannel);
            // 10분 경과시 채팅방을 삭제하기 위한 코드 추가

            // 1/11) DeleteChannelAfter10Minutes 이외 다른 방식으로 구현함

            // DeleteChannelAfter10Minutes(groupChannel);

            // console.log(
            // 'groupChannel In CreateChating Function In MapScreen:',
            // groupChannel,
            // );
          }
        },
      );
    }
  };

  const CreateCanSendMetaData = (
    channel: any,
    OtherMetadDataKey: string,
    MyMetaDataKey: string,
  ) => {
    let Metadata = {
      [OtherMetadDataKey]: '0',
      [MyMetaDataKey]: '0',
    };

    channel.createMetaData(Metadata, function (response: any, error: Error) {
      if (error) {
        // Handle error.
      }
    });
  };

  const chat = (channel: any) => {
    navigation.navigate('ChatScreen', {
      channel,
      UserData,
    });
  };

  const {
    data,
    isLoading,
    refetch: GirlsLocationsrefetch,
  } = useQuery('QueryLocation', Get_GirlsLocation);

  const {
    data: MansLocations,
    isLoading: isLoadingMansLocations,
    refetch: MansLocationsretech,
  } = useQuery('MansLocationsUseQuery', Get_MansLocations);

  const {data: itaewon_HotPlaceList, isLoading: itaewon_HotPlaceListisLoading} =
    useQuery('itaewon_HotPlaceList', Get_itaewon_HotPlaceList);
  const {data: GangNam_HotPlaceList, isLoading: GangNam_HotPlaceListisLoading} =
    useQuery('GangNam_HotPlaceList', Get_GangNam_HotPlaceList);
  const {data: Sinsa_HotPlaceList, isLoading: Sinsa_HotPlaceListisLoading} =
    useQuery('Sinsa_HotPlaceList', Get_Sinsa_HotPlaceList);

  const moveToMyLocation = () => {
    const region = {...location, ...LOCATION_DELTA};
    // console.log(region);
    mapRef.current.animateToRegion(region);
    // console.log('[MapScreen] moveToMyLocation called');
  };

  const AnimationMarker = (ProfileImageUrl: string) => {
    return (
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}>
        <View style={[MarkerAnimationStyles.dot, MarkerAnimationStyles.center]}>
          {[...Array(3).keys()].map((_, index) => (
            <Ring key={index} index={index} />
          ))}
          <Image
            style={MarkerAnimationStyles.Image}
            source={{uri: ProfileImageUrl}}
          />
        </View>
      </Marker>
    );
  };

  const MinusIcon = (
    <TouchableOpacity
      onPress={() => {
        if (PeopleNum > 1) {
          setPeopleNum(PeopleNum - 1);
        }
      }}>
      {MinusSvg(30)}
    </TouchableOpacity>
  );

  const PlusIcon = (
    <TouchableOpacity
      onPress={() => {
        if (PeopleNum < 10) {
          setPeopleNum(PeopleNum + 1);
        }
      }}>
      {PlusSvg(30)}
    </TouchableOpacity>
  );

  const ProfileImage = () => {
    return (
      <Image
        source={{uri: ProfileImageUrl}}
        style={{width: 100, height: 100, borderRadius: 10}}
      />
    );
  };

  const M5NickName = (
    <Text
      style={{
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        marginLeft: '5%',
        marginBottom: 20,
        marginTop: 20,
      }}>
      {ProfileForGtoM?.NickName}
    </Text>
  );

  const MainImage = () => {
    const ImageArray = [
      ProfileForGtoM.ProfileImageUrl,
      // ProfileForGtoM.FriendProfileImageUrl,
      ProfileForGtoM.ProfileImageUrl2,
      // ProfileForGtoM.FriendProfileImageUrl2,
      ProfileForGtoM.ProfileImageUrl3,
      ProfileForGtoM.ProfileImageUrl4,
      ProfileForGtoM.ProfileImageUrl5,
      ProfileForGtoM.ProfileImageUrl6,
    ];
    const FiliterImageArray = ImageArray.filter((data: any) => {
      return data != undefined && data != '';
    });
    return (
      <View
        style={{
          width: '95%',
          marginLeft: '2.5%',
          height: '81%',
          borderRadius: 31,
          marginTop: 10,
        }}>
        <Swiper
          // onTouchEnd={(e, state, context) => {
          //   if (ProfileForGtoM.FriendProfileImageUrl != '') {
          //     if (OddNumValid(state.index) == true) {
          //       setShowMbti(ProfileForGtoM.Mbti);
          //       setShowNickName(ProfileForGtoM.NickName);
          //     } else if (OddNumValid(state.index) == false) {
          //       setShowMbti(ProfileForGtoM.FriendMbti);
          //       setShowNickName(ProfileForGtoM.FriendNickName);
          //     }
          //   }
          // }}

          paginationStyle={{
            width: '70%',
            height: 2.5,
            position: 'absolute',
            top: 24,
            left: '15%',
            display: 'flex',
            flexDirection: 'row',
            zIndex: 10,
          }}
          dot={
            <View
              style={{
                height: '100%',
                width: `${100 / FiliterImageArray.length}%`,
                backgroundColor: '#00000014',
                borderRadius: 4,
              }}></View>
          }
          activeDot={
            <View
              style={{
                height: '100%',
                width: `${100 / FiliterImageArray.length}%`,
                backgroundColor: 'white',
                borderRadius: 4,
              }}></View>
          }>
          {FiliterImageArray.map((data, index) => {
            // console.log(data);
            return (
              <Image
                key={index}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 31,
                }}
                source={{
                  uri: data,
                }}
              />
            );
          })}
        </Swiper>
      </View>
    );
  };

  const Desc = (
    <View style={{marginBottom: 10}}>
      <Text
        style={[
          MapScreenStyles.WhiteText,
          {marginBottom: 10, fontWeight: '700', fontSize: 20},
        ]}>
        👩🏼 인원수:{ProfileForGtoM?.PeopleNum}명
      </Text>
      <Text
        style={[
          MapScreenStyles.WhiteText,
          {
            marginBottom: 10,
            fontSize: 16,
            fontWeight: '600',
            // color:'#efa5c8'
          },
        ]}>
        💸 지불여부: {ProfileForGtoM?.CanPayit}
      </Text>
      <Text
        style={[
          MapScreenStyles.WhiteText,
          {marginBottom: 10, fontSize: 16, fontWeight: '500'},
        ]}>
        💌 메모:{ProfileForGtoM?.Memo}
      </Text>
    </View>
  );

  const ChatView = (
    <View style={MapScreenStyles.ChatView}>
      <TouchableOpacity onPress={() => CreateChating()}>
        {M5ChatSvg(width * 0.17)}
      </TouchableOpacity>
    </View>
  );

  const ImageBar = (
    <View style={MapScreenStyles.ImageBar}>
      <View style={MapScreenStyles.ImageBarBox}>
        {PaySvg(22)}
        <Text style={styles.WhiteColor}>비용</Text>
        <Text style={MapScreenStyles.ImageBarText}>더치페이</Text>
      </View>
      <View style={MapScreenStyles.ImageBarBox}>
        {ColorPeopleSvg(22)}
        <Text style={styles.WhiteColor}>인원수</Text>
        <Text style={MapScreenStyles.ImageBarText}>
          {ProfileForGtoM?.PeopleNum}명
        </Text>
      </View>
    </View>
  );

  const ShowClickedUserDataModal = () => {
    return (
      <Modal
        animationIn="slideInUp"
        // transparent={true}
        isVisible={ShowUserModal}
        coverScreen={false}
        onBackdropPress={() => setShowUserModal(false)}
        // onSwipeComplete={() => setShowUserModal(false)}
        // swipeDirection="down"
      >
        <View
          style={[
            styles.W95ML5,
            {height: '65%', backgroundColor: '#313A5B', borderRadius: 26},
          ]}>
          {ProfileForGtoM.ProfileImageUrl != undefined ? MainImage() : null}
          {/* <MapTopLine /> */}

          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '20%',
              bottom: '24%',
            }}>
            <View
              style={{
                marginLeft: 24,
                width: '50%',
              }}>
              <Text style={{color: 'white', fontWeight: '700', fontSize: 17}}>
                {ProfileForGtoM.NickName} {ProfileForGtoM.Age}
                {/* {ShowNickName} */}
              </Text>
              <Text style={{color: 'white', marginTop: 5, fontWeight: '400'}}>
                {/* {ShowMbti} */}
              </Text>
              <Text
                style={{color: 'white', marginTop: 5, fontWeight: '400'}}
                numberOfLines={2}>
                {ProfileForGtoM.Memo}
              </Text>
            </View>

            {ImageBar}
          </View>

          {ChatView}
          {/* {ProfileForGtoM.Memo != '' ? Desc : null} */}
        </View>
      </Modal>
    );
  };

  // const TopLine = (
  //   <View
  //     style={{
  //       width: '100%',
  //       height: 2,
  //       display: 'flex',
  //       flexDirection: 'row',
  //       justifyContent: 'center',
  //     }}>
  //     <View
  //       style={{
  //         height: 2,
  //         width: 80,
  //         backgroundColor: 'gray',
  //         borderRadius: 25,
  //       }}
  //     />
  //   </View>
  // );

  const ShowMyProfileModal = () => {
    return (
      <Modal
        // animationType='slide'
        animationIn={'slideInUp'}
        isVisible={ProfileModalVisiable}
        onBackdropPress={() => setProfileModalVisiable(false)}
        // visible={ProfileModalVisiable}
        transparent={true}
        style={{width: '100%', height: '100%'}}
        onSwipeComplete={() => setProfileModalVisiable(false)}
        swipeDirection="down"
        // coverScreen={false}
      >
        <SafeAreaView style={MapScreenStyles.ProfileModalParent}>
          <View style={styles.W90ML5}>
            {/* {TopLine} */}

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 40,
              }}>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: 'white',
                  borderRadius: 10,
                }}
                onPress={() => {
                  ChangeMyProfileImage(
                    UserData.UserEmail,
                    UserData.Gender,
                    navigation,
                    1,
                    setProfileImageUrl,
                    UserData.NickName,
                    SendBird,
                  );
                }}>
                {ProfileImage()}
              </TouchableOpacity>
            </View>

            <Text style={{color: 'white', fontSize: 22, fontWeight: '600'}}>
              내 등급
            </Text>
            <Text style={{color: 'white', marginLeft: '50%'}}>50%</Text>
            <Progress.Bar
              progress={0.5}
              width={width * 0.9}
              // indeterminate={true}
              color={'skyblue'}
              // unfilledColor={'black'}
              borderWidth={1}
              // borderColor="red"
              height={8}
              borderRadius={15}
            />
            <Button
              title="X"
              onPress={() => {
                setProfileModalVisiable(false);
              }}
            />

            <Text style={[styles.WhiteColor]}>
              내 latitude:{location?.latitude}
            </Text>
            <Text style={[styles.WhiteColor]}>
              내 longitude:{location?.longitude}
            </Text>

            {InvitationCodeToFriend.length != 0 ? (
              <>
                <Text style={styles.WhiteColor}>
                  초대코드1: {InvitationCodeToFriend[0].InvitationCode}{' '}
                  {InvitationCodeToFriend[0].Used ? '사용됨' : '초대하기'}
                </Text>
                <Text style={styles.WhiteColor}>
                  초대코드2: {InvitationCodeToFriend[1].InvitationCode}{' '}
                  {InvitationCodeToFriend[1].Used ? '사용됨' : '초대하기'}
                </Text>
              </>
            ) : null}

            <Text style={styles.WhiteColor}>
              Email: {UserData.UserEmail} / NickName: {UserData.NickName}
            </Text>
            <Text style={styles.WhiteColor}>
              Async에 저장된 email: {AsyncEmail}
            </Text>

            <Button
              title="로그아웃 하기"
              color={'red'}
              onPress={() => {
                setProfileModalVisiable(!ProfileModalVisiable);
                logout(navigation, SendBird);
              }}></Button>

            <Button
              title="남자로 변경"
              onPress={() => {
                firestore()
                  .collection('UserList')
                  .doc(UserData.UserEmail)
                  .update({
                    Gender: 1,
                  });

                navigation.navigate('IndicatorScreen', {
                  From: 'Map',
                });
              }}
            />

            <Button
              title="여자로 변경"
              onPress={() => {
                firestore()
                  .collection('UserList')
                  .doc(UserData.UserEmail)
                  .update({
                    Gender: 2,
                  });

                navigation.navigate('IndicatorScreen', {
                  From: 'Map',
                });
              }}
            />

            <Button
              title="L1으로 이동"
              onPress={() => {
                navigation.navigate('MeetMapScreen', {});
                setProfileModalVisiable(false);
              }}
            />

            <Button
              title="회원탈퇴 하기"
              color={'red'}
              onPress={() => {
                navigation.navigate('WithdrawalScreen', {
                  logout: logout,
                  UserEmail: UserData.UserEmail,
                });
              }}></Button>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const M3Main_PeopleNumSelect = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {
          width: '100%',
          height: H11,
        },
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}
        {PeopleNum == 0 ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>인원</Text>
        <View style={[MapScreenStyles.PeopleNumOption]}>
          {PeopleSvg(width * 0.06, {marginLeft: 10})}
          <View
            style={[
              styles.Row_OnlyColumnCenter,
              {
                width: '40%',
                justifyContent: 'space-around',
                // backgroundColor: 'red',
              },
            ]}>
            {MinusIcon}
            <Text style={[MapScreenStyles.TotalPeopleNum]}>{PeopleNum}명</Text>
            {PlusIcon}
          </View>
        </View>
      </View>
    </View>
  );

  const M3Main_FriendEmail = (
    <View style={[styles.Row_OnlyColumnCenter, {height: H11, width: '100%'}]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}

        {FriendEmail == '' ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>인원 추가</Text>
        <View style={[MapScreenStyles.FriendAdd]}>
          {PeopleAddSvg(width * 0.06, {marginLeft: 10, marginRight: 5})}
          <TextInput
            value={FriendEmail}
            onChangeText={(text) => setFriendEmail(text)}
            style={MapScreenStyles.MemoTextInput}
            placeholder="닉네임을 입력해주세요"></TextInput>
        </View>

        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            fontWeight: '500',
            color: '#DFE5F180',
            marginLeft: 10,
          }}>
          랑데부 가입자가 아닌 유저일 시 닉네임을 입력해주세요
        </Text>
      </View>
    </View>
  );

  const [selectedItem, setSelectedItem] = useState(null);

  const searchRef = useRef(null);
  const dropdownController = useRef(null);

  const M3Main_FriendEmail_Auto = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {height: H11, width: '100%', zIndex: 1},
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}

        {FriendEmail == '' ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>인원 추가</Text>
        <View style={[MapScreenStyles.FriendAdd]}>
          {/* <TextInput
            value={FriendEmail}
            onChangeText={(text) => setFriendEmail(text)}
            style={MapScreenStyles.MemoTextInput}
            placeholder="닉네임을 입력해주세요"></TextInput> */}

          <AutocompleteDropdown
            ref={searchRef}
            useFilter={false}
            controller={(controller) => {
              dropdownController.current = controller;
            }}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            initialValue={{id: '2'}} // or just '2'
            onSelectItem={(item) => {
              item && // console.log(item.UserEmail);
                item &&
                setFriendEmail(item.UserEmail);
            }}
            dataSet={NickNameList}
            containerStyle={{flex: 1}}
            p
            // ChevronIconComponent={
            //   <MaterialIcons name="my-location" size={27} color="#6713D2" />
            // }
            // ClearIconComponent={
            //   <MaterialIcons name="my-location" size={27} color="#6713D2" />
            // }
            keyExtractor={(item: any) => item.id}
          />
        </View>

        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            fontWeight: '500',
            color: '#DFE5F180',
            marginLeft: 10,
          }}>
          랑데부 가입자가 아닌 유저일 시 닉네임을 입력해주세요
        </Text>
      </View>
    </View>
  );

  const M3Main_MemoInput = (
    <View style={[styles.Row_OnlyColumnCenter, {height: H11, width: '100%'}]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}

        {Memo == '' ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>
          상태 메세지 입력하기
        </Text>
        <View style={[MapScreenStyles.FriendAdd]}>
          {MemoSvg(width * 0.06, {marginLeft: 10, marginRight: 5})}
          <TextInput
            value={Memo}
            onChangeText={(text) => setMemo(text)}
            style={MapScreenStyles.MemoTextInput}
            placeholder="상대방에게 전하고 싶은 메세지를 입력하세요"></TextInput>
        </View>
        {/* <Text>랑데부 가입자가 아닌 유저일 시 닉네임을 입력해주세요</Text> */}
      </View>
    </View>
  );

  const OnePress = () => {
    if (MoenyRadioBox == 1) {
      setMoneyRadioBox(0);
    } else {
      setMoneyRadioBox(1);
    }
  };

  const TwoPress = () => {
    if (MoenyRadioBox == 2) {
      setMoneyRadioBox(0);
    } else {
      setMoneyRadioBox(2);
    }
  };

  const M3Main_PayOption1 = (
    <View style={MapScreenStyles.M3Main_PayOption}>
      <Text
        style={{
          fontSize: 21.3,
        }}>
        🤔
      </Text>
      <Text
        style={{
          fontWeight: '400',
          fontSize: 10.5,
        }}>
        보고 결정
      </Text>
    </View>
  );

  const M3Main_PayOption2 = (
    <View style={MapScreenStyles.M3Main_PayOption}>
      <Text
        style={{
          fontSize: 21.3,
        }}>
        🤝
      </Text>
      <Text
        style={{
          fontWeight: '400',
          fontSize: 10.5,
        }}>
        더치페이
      </Text>
    </View>
  );

  const M3Main_SelectedPayOption1 = (
    <LinearGradient
      colors={Type2세로}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={MapScreenStyles.M3Main_PayOption}>
      <Text
        style={{
          fontSize: 21.3,
        }}>
        🤔
      </Text>
      <Text
        style={{
          fontWeight: '400',
          fontSize: 10.5,
        }}>
        보고 결정
      </Text>
    </LinearGradient>
  );

  const M3Main_SelectedPayOption2 = (
    <LinearGradient
      colors={Type2세로}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={MapScreenStyles.M3Main_PayOption}>
      <Text
        style={{
          fontSize: 21.3,
        }}>
        🤝
      </Text>
      <Text
        style={{
          fontWeight: '400',
          fontSize: 10.5,
        }}>
        더치페이
      </Text>
    </LinearGradient>
  );

  const M3Main_PaySelect = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {
          height: H11,
          width: '100%',
        },
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}

        {MoenyRadioBox == 0 ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>비용</Text>

        <View style={[MapScreenStyles.PayOption]}>
          <TouchableOpacity
            style={{height: '100%', width: '33%'}}
            onPress={() => OnePress()}>
            {MoenyRadioBox == 1 ? M3Main_SelectedPayOption1 : M3Main_PayOption1}
          </TouchableOpacity>
          <TouchableOpacity
            style={{height: '100%', width: '33%'}}
            onPress={() => TwoPress()}>
            {MoenyRadioBox == 2 ? M3Main_SelectedPayOption2 : M3Main_PayOption2}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const M3Main_legacy = (
    <SafeAreaView style={MapScreenStyles.Memomodal}>
      <Text
        style={{
          color: 'white',
          fontSize: 22,
          fontWeight: '500',
          marginLeft: '5%',
          marginBottom: 20,
          marginTop: 20,
        }}>
        나의 상태 설정하기
      </Text>
      <View style={[{height: 96}, styles.W90ML5]}>
        <Text
          style={[
            MapScreenStyles.WhiteText,
            {fontSize: 14, fontWeight: '500', marginBottom: 8},
          ]}>
          메모로 상태알리기
        </Text>
        <Text
          style={[
            {
              fontSize: 12,
              fontWeight: '400',
              color: '#6A6A6A',
              marginBottom: 8,
            },
          ]}>
          고객님의 상태, 위치, 정보를 50자 이내로 입력해주세요.
        </Text>
        <TextInput
          value={Memo}
          onChangeText={(text) => setMemo(text)}
          style={MapScreenStyles.MemoTextInput}></TextInput>
      </View>

      <View
        style={[styles.W90ML5, {height: 96, marginTop: 20, marginBottom: 20}]}>
        <Text
          style={[
            MapScreenStyles.WhiteText,
            styles.FW500FS14,
            {marginBottom: 8},
          ]}>
          인원알려주기
        </Text>
        <Text
          style={[
            {
              fontSize: 12,
              fontWeight: '400',
              color: '#6A6A6A',
              marginBottom: 8,
            },
          ]}>
          몇명이서 오셨나요?
        </Text>

        <View
          style={[
            MapScreenStyles.PeopleNumOption,
            styles.Row_OnlyColumnCenter,
          ]}>
          <Text
            style={[
              styles.WhiteColor,
              styles.FW500FS14,
              {marginLeft: '5%', marginBottom: 10},
            ]}>
            인원
          </Text>
          <View
            style={[
              styles.Row_OnlyColumnCenter,
              {
                width: '30%',
                justifyContent: 'space-between',
                marginRight: '5%',
              },
            ]}>
            {MinusIcon}
            <Text style={[styles.WhiteColor, MapScreenStyles.TotalPeopleNum]}>
              {PeopleNum}명
            </Text>
            {PlusIcon}
          </View>
        </View>
      </View>

      <View style={[{height: 110, marginBottom: 10}, styles.W90ML5]}>
        <Text
          style={[
            MapScreenStyles.WhiteText,
            {fontSize: 14, fontWeight: '500', marginBottom: 8},
          ]}>
          비용 나눠 내기
        </Text>
        <Text
          style={[
            {
              fontSize: 12,
              fontWeight: '400',
              color: '#6A6A6A',
              marginBottom: 8,
            },
          ]}>
          만남 후 비용을 나눠서 지불할 생각이 있으신가요?
        </Text>
        <View
          style={[
            styles.Row_OnlyColumnCenter,
            MapScreenStyles.MoneyOptionView,
            {marginTop: 10},
          ]}>
          <TouchableOpacity
            onPress={() => {
              setMoneyRadioBox(1);
            }}
            style={
              MoenyRadioBox == 1
                ? MapScreenStyles.SelectedMoneyIconBox
                : MapScreenStyles.MoneyIconBox
            }>
            <Text
              style={
                MoenyRadioBox == 1
                  ? {color: '#606060', fontWeight: '600'}
                  : {color: '#202124', fontWeight: '600'}
              }>
              보고결정
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMoneyRadioBox(2);
            }}
            style={
              MoenyRadioBox == 2
                ? MapScreenStyles.SelectedMoneyIconBox
                : MapScreenStyles.MoneyIconBox
            }>
            <Text
              style={
                MoenyRadioBox == 2
                  ? {color: '#606060', fontWeight: '600'}
                  : {color: '#202124', fontWeight: '600'}
              }>
              생각있음
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMoneyRadioBox(3);
            }}
            style={
              MoenyRadioBox == 3
                ? MapScreenStyles.SelectedMoneyIconBox
                : MapScreenStyles.MoneyIconBox
            }>
            <Text
              style={
                MoenyRadioBox == 3
                  ? {color: '#606060', fontWeight: '600'}
                  : {color: '#202124', fontWeight: '600'}
              }>
              생각없음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.Row_OnlyColumnCenter]}>
        <TouchableOpacity
          style={[styles.RowCenter, MapScreenStyles.CancelBoxView]}
          onPress={() => {
            ChangeModalVisiable();
          }}>
          <Text>취소</Text>
        </TouchableOpacity>

        {Memo == '' && MoenyRadioBox != 0 ? (
          <TouchableOpacity
            onPress={() => {
              ShowMyLocation();
            }}>
            {ClickedCompleteSvg(width * 0.37)}
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.RowCenter,
              MapScreenStyles.CheckBoxView,
              {backgroundColor: '#565656'},
            ]}>
            <Text>완료</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  const GirlInputStateModal = () => {
    return (
      <Modal
        animationIn="slideInUp"
        // transparent={true}
        isVisible={ModalVisiable}
        coverScreen={false}
        style={[
          styles.W100H100,
          {
            right: '5%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginTop: 0,
            marginBottom: 0,
          },
        ]}>
        <KeyboardAvoidingView
          contentContainerStyle={{
            flex: 1,
          }}
          behavior="position"
          enabled
          // keyboardVerticalOffset={300}
        >
          <View>{M3TopSvg(width)}</View>
          <View
            style={{
              marginLeft: '8%',
              marginTop: '5%',
            }}>
            {M3Main_TopBarSvg(width * 0.84)}
          </View>

          <View
            style={{
              width: '84%',

              height: height * 0.55,
              marginLeft: '8%',
              marginTop: '-3%',
              backgroundColor: '#37375B',
              borderBottomEndRadius: 48,
              borderBottomStartRadius: 48,
            }}>
            {M3Main_PeopleNumSelect}
            {PeopleNum >= 2 ? M3Main_FriendEmail_Auto : null}
            {M3Main_MemoInput}
            {M3Main_PaySelect}
            <View
              style={[
                styles.Row_OnlyFlex,

                {
                  marginTop: 10,
                  width: '100%',
                  height: H11,
                },
                // {backgroundColor: 'pink'},
              ]}>
              <TouchableOpacity
                style={[styles.RowCenter, MapScreenStyles.CancelBoxView]}
                onPress={() => {
                  ChangeModalVisiable();
                }}>
                <Text>취소</Text>
              </TouchableOpacity>

              {Memo != '' && MoenyRadioBox != 0 ? (
                <TouchableOpacity
                  style={MapScreenStyles.CheckBoxView}
                  onPress={() => {
                    ShowMyLocation();
                  }}>
                  <LinearGradient
                    colors={Type2세로}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={[
                      styles.RowCenter,
                      {width: '100%', height: '100%', borderRadius: 9},
                    ]}>
                    <Text>완료</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.RowCenter,
                    MapScreenStyles.CheckBoxView,
                    {backgroundColor: '#DFE5F1'},
                  ]}>
                  <Text>완료</Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const [ShowEnter_MatchModal, setShowEnter_MatchModal] = useState(false);
  const ChangeEnter_MatchVis = () => {
    setShowEnter_MatchModal(!ShowEnter_MatchModal);
  };
  const Enter_MatchModal = () => {
    return (
      <Modal
        animationIn="slideInUp"
        isVisible={ShowEnter_MatchModal}
        onBackdropPress={() => ChangeEnter_MatchVis()}
        style={[
          styles.W100H100,
          {
            right: '5%',
          },
        ]}>
        {/* <View style={MapScreenStyles.MatchModal}> */}
        {Btn_MatchComponent()}
        {Btn_RandomMatchComponent()}
        {ClickedBottomBar()}
        {/* </View> */}
      </Modal>
    );
  };

  const HPMarker = (datas: Array<any>) => {
    let Result: Array<any> = [];

    for (let data of datas) {
      let Obj = (
        <Marker
          key={data.Title}
          coordinate={{
            latitude: data.latitude,
            longitude: data.longitude,
          }}
          title={data.Title}
          tracksViewChanges={false}>
          <View>
            <Image
              source={{uri: data.Image}}
              style={MapScreenStyles.HP_Marker}
              resizeMode="cover"
            />
          </View>
        </Marker>
      );
      Result.push(Obj);
    }
    return Result;
  };

  // const GpsOnOffSwitch = (onValueChangeFun: Function) => {
  //   return (
  //     <Switch
  //       // trackColor={{false: '#202124', true: '#202124'}}
  //       trackColor={{false: 'B5BAC0', true: '#7B68EE'}}
  //       // thumbColor={GpsOn ? '#28FF98' : '#f4f3f4'}
  //       thumbColor={'white'}
  //       ios_backgroundColor="#B5BAC0"
  //       onValueChange={onValueChangeFun}
  //       value={GpsOn}
  //     />
  //   );
  // };

  const GpsOnOffSwitch = (onValueChangeFun: Function) => {
    {
      GpsOn == false ? (
        <TouchableOpacity
          onPress={() => {
            onValueChangeFun();
          }}>
          {OffToggleSvg}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            onValueChangeFun();
          }}>
          {OnToggleSvg}
        </TouchableOpacity>
      );
    }
  };

  const Btn_OnToggle = (onValueChangeFun: Function) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onValueChangeFun();
        }}>
        {OnToggleSvg}
      </TouchableOpacity>
    );
  };
  const Btn_OffToggle = (onValueChangeFun: Function) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onValueChangeFun();
        }}>
        {OffToggleSvg}
      </TouchableOpacity>
    );
  };

  const View_GpsOff = () => {
    return (
      <View
        style={[
          styles.NoFlexDirectionCenter,
          {
            width: 38,
            height: 22,
            backgroundColor: '#B4B4B4',
            borderRadius: 4,
          },
        ]}>
        <Text style={{fontWeight: '500', fontSize: 14}}>OFF</Text>
      </View>
    );
  };

  const View_GpsOn = () => {
    return (
      <View
        style={[
          styles.NoFlexDirectionCenter,
          {
            width: 33,
            height: 22,
            backgroundColor: '#28FF98',
            borderRadius: 4,
          },
        ]}>
        <Text style={{fontWeight: '500', fontSize: 14}}>ON</Text>
      </View>
    );
  };

  const GradientTimeText = (
    <GradientText
      colors={Type2가로}
      style={{
        fontWeight: '500',
        fontSize: 16,
      }}>
      {Math.floor(second / 60)} : {second % 60}
    </GradientText>
  );

  const OffTimeText = (
    <Text
      style={{
        fontSize: 16,
        fontWeight: '500',
        color: '#9F9F9F',
      }}>
      {Math.floor(second / 60)} : {second % 60}
    </Text>
  );

  const GradientLocationText = (
    <GradientText
      colors={Type2가로}
      style={{
        fontWeight: '500',
        fontSize: 16,
      }}>
      내위치 표시중
    </GradientText>
  );

  const LocationText = (
    <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>
      내 위치 표시 대기중
    </Text>
  );

  const GirlTabBar = () => {
    return (
      <SafeAreaView
        style={[styles.Row_OnlyColumnCenter, MapScreenStyles.TopView]}>
        {GpsOn == false ? LocationText : null}
        {GpsOn == false ? OffTimeText : GradientTimeText}
        {GpsOn == true ? Btn_OnToggle(StopShowMyLocation) : null}
        {GpsOn == false ? OffSvg : OnSvg}
        {/* {GpsOn == false ? View_GpsOff() : View_GpsOn()} */}
      </SafeAreaView>
    );
  };

  const ManTabBar = () => {
    return (
      <SafeAreaView
        style={[styles.Row_OnlyColumnCenter, MapScreenStyles.TopView]}>
        {GpsOn == false ? LocationText : GradientLocationText}

        {GpsOn == false
          ? Btn_OffToggle(ChangeShowStateMan)
          : Btn_OnToggle(ChangeShowStateMan)}

        {GpsOn == false ? OffSvg : OnSvg}
      </SafeAreaView>
    );
  };

  const TouchableBtn_EnterMatch = () => {
    if (ShowEnter_MatchModal == false) {
      return (
        <TouchableOpacity
          onPress={() => {
            ChangeEnter_MatchVis();
          }}>
          {Enter_MatchSvg(80)}
        </TouchableOpacity>
      );
    }
  };

  const Btn_EnterChat = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChatListScreen', {
            UserData,
          });
        }}>
        {Enter_ChatSvg(80)}
      </TouchableOpacity>
    );
  };

  const Btn_EnterFriendMap = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('FriendMapScreen', {
          //   UserData,
          // });

          setProfileModalVisiable(true);
        }}>
        {Enter_FriendMapSvg(80)}
      </TouchableOpacity>
    );
  };

  const Btn_EnterSetting = () => {
    return (
      <TouchableOpacity onPress={() => {}}>
        {Enter_SettingSvg(50)}
      </TouchableOpacity>
    );
  };

  const Btn_ClickedEnter_Match = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          ChangeEnter_MatchVis();
        }}>
        {ClickedEnter_MatchSvg(95)}
      </TouchableOpacity>
    );
  };

  const BottomBar_Girl = () => {
    return (
      <View
        style={[
          MapScreenStyles.StartView,
          styles.Row_OnlyColumnCenter,
          {justifyContent: 'space-around'},
        ]}>
        {Btn_EnterChat()}
        {TouchableBtn_EnterMatch()}
        {/* {Btn_EnterFriendMap()} */}
      </View>
    );
  };

  const BottomBar_Man = () => {
    return (
      <View
        style={[
          MapScreenStyles.StartView,
          styles.Row_OnlyColumnCenter,
          {justifyContent: 'space-around'},
        ]}>
        {Btn_EnterChat()}
        {/* {Btn_EnterFriendMap()} */}
      </View>
    );
  };

  const ClickedBottomBar = () => {
    return (
      <View style={[MapScreenStyles.ClickedBottomBar, styles.RowCenter]}>
        {Btn_ClickedEnter_Match()}
      </View>
    );
  };

  const Btn_MatchComponent = () => {
    return (
      <TouchableOpacity
        style={MapScreenStyles.Btn_Match}
        onPress={() => {
          ChangeEnter_MatchVis();
          setTimeout(() => {
            ChangeModalVisiable();
          }, 500);
        }}>
        {GeneralMatchSvg(120)}
      </TouchableOpacity>
    );
  };

  const Btn_RandomMatchComponent = () => {
    return (
      <TouchableOpacity
        style={MapScreenStyles.Btn_RandomMatch}
        onPress={() => {
          // ChangeModalVisiable();
        }}>
        {RandomMatchSvg(120)}
      </TouchableOpacity>
    );
  };

  // const Btn_MatchStart = () => {
  //   return (
  //     <TouchableOpacity
  //       style={MapScreenStyles.Btn_MatchStart}
  //       onPress={() => {
  //         ChangeModalVisiable();
  //       }}>
  //       {Btn_MatchStartSvg(142)}
  //     </TouchableOpacity>
  //   );
  // };

  // const Btn_MatchStarted = () => {
  //   return (
  //     <TouchableOpacity
  //       style={MapScreenStyles.Btn_MatchStart}
  //       onPress={() => {
  //         ChangeModalVisiable();
  //       }}>
  //       {Btn_MatchStartedSvg(142)}
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <View style={{width: '100%', height: '100%'}}>
      {/* 1. 내 프로필 정보를 보여주는 (GM3) 2. 클릭된 유저 정보를 보여주는(GM4) 3. 시작하기 클릭시 나오는 모달 */}
      {ShowMyProfileModal()}
      {GirlInputStateModal()}
      {ShowClickedUserDataModal()}
      {Enter_MatchModal()}
      {location && (
        <MapView
          style={{width: '100%', height: '100%'}}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          ref={mapRef}
          showsUserLocation={true}
          loadingEnabled={true}
          // userInterfaceStyle="light"
          userInterfaceStyle="dark"
          minZoomLevel={10}
          maxZoomLevel={17}>
          {GpsOn == true ? AnimationMarker(ProfileImageUrl) : null}
          {isLoading == false && UserData.Gender == 1 && GpsOn == true
            ? data?.map((data: any, index) => {
                return (
                  <Marker
                    key={data.latitude}
                    coordinate={{
                      latitude: data.latitude,
                      longitude: data.longitude,
                    }}
                    // title={data?.Memo}
                    tracksViewChanges={false}
                    // description={'인원: ' + data.PeopleNum + ' 지불여부: ' + data.CanPayit + " 메모: " + data.Memo}
                    onPress={() => {
                      // let obj = {
                      //   data.ProfileImageUrl,
                      //   data.UserEmail,
                      //   data.Memo,
                      //   data.PeopleNum,
                      //   data.CanPayit,
                      //   data.NickName,
                      //   data.latitude,
                      //   data.longitude,
                      // }
                      GirlMarkerOnPress({
                        ProfileImageUrl: data?.ProfileImageUrl,
                        ProfileImageUrl2: data?.ProfileImageUrl2,
                        ProfileImageUrl3: data?.ProfileImageUrl3,
                        ProfileImageUrl4: data?.ProfileImageUrl4,
                        ProfileImageUrl5: data?.ProfileImageUrl5,
                        ProfileImageUrl6: data?.ProfileImageUrl6,
                        FriendProfileImageUrl: data?.FriendProfileImageUrl,
                        FriendProfileImageUrl2: data?.FriendProfileImageUrl2,
                        FriendMbti: data?.FriendMbti,
                        FriendNickName: data?.FriendNickName,
                        UserEmail: data?.UserEmail,
                        Memo: data.Memo,
                        PeopleNum: data.PeopleNum,
                        CanPayit: data.CanPayit,
                        NickName: data.NickName,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        Mbti: data.Mbti,
                      });
                    }}>
                    <View
                      style={[
                        MarkerAnimationStyles.dot,
                        MarkerAnimationStyles.center,
                        {},
                      ]}>
                      {Platform.OS == 'ios'
                        ? [...Array(2).keys()].map((_, index) => (
                            <OtherRing key={index} index={index} />
                          ))
                        : null}

                      <Image
                        style={MapScreenStyles.GirlsMarker}
                        source={{uri: data.ProfileImageUrl}}
                        resizeMode="cover"
                      />
                    </View>
                  </Marker>
                );
              })
            : null}

          {isLoadingMansLocations == false && UserData.Gender == 2
            ? MansLocations.map((MansData: any, index) => {
                return (
                  <Marker
                    key={MansData.latitude}
                    coordinate={{
                      latitude: MansData.latitude,
                      longitude: MansData.longitude,
                    }}
                    tracksViewChanges={false}
                    onPress={() => {
                      GirlMarkerOnPress({
                        ProfileImageUrl: MansData?.ProfileImageUrl,
                        ProfileImageUrl2: MansData?.ProfileImageUrl2,
                        ProfileImageUrl3: MansData?.ProfileImageUrl3,
                        ProfileImageUrl4: MansData?.ProfileImageUrl4,
                        ProfileImageUrl5: MansData?.ProfileImageUrl5,
                        ProfileImageUrl6: MansData?.ProfileImageUrl6,
                        FriendProfileImageUrl: MansData?.FriendProfileImageUrl,
                        FriendProfileImageUrl2:
                          MansData?.FriendProfileImageUrl2,
                        FriendMbti: MansData?.FriendMbti,
                        FriendNickName: MansData?.FriendNickName,
                        UserEmail: MansData?.UserEmail,
                        Memo: '',
                        PeopleNum: 1,
                        CanPayit: '',
                        NickName: MansData.NickName,
                        latitude: MansData.latitude,
                        longitude: MansData.longitude,
                        Mbti: MansData.Mbti,
                      });
                    }}>
                    <View>
                      <Image
                        source={{uri: MansData.ProfileImageUrl}}
                        style={MapScreenStyles.GirlsMarker}
                        resizeMode="cover"
                      />
                    </View>
                  </Marker>
                );
              })
            : null}

          {itaewon_HotPlaceListisLoading == false
            ? HPMarker(itaewon_HotPlaceList)
            : null}

          {GangNam_HotPlaceListisLoading == false
            ? HPMarker(GangNam_HotPlaceList)
            : null}

          {Sinsa_HotPlaceListisLoading == false
            ? HPMarker(Sinsa_HotPlaceList)
            : null}
        </MapView>
      )}

      {UserData.Gender == 2 ? GirlTabBar() : ManTabBar()}

      <View
        style={[
          styles.NoFlexDirectionCenter,
          MapScreenStyles.ChangeProfileView,
        ]}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: '#202632',
              borderRadius: 25,
            },
            styles.NoFlexDirectionCenter,
          ]}
          onPress={() => {
            navigation.navigate('MyProfileScreen', {
              UserData,
            });
            // setProfileModalVisiable(true);
          }}>
          <Image
            source={{uri: ProfileImageUrl}}
            style={{width: 43, height: 43, borderRadius: 35}}
          />
        </TouchableOpacity>
      </View>

      {UserData.Gender == 2 ? BottomBar_Girl() : BottomBar_Man()}

      <View>
        <TouchableOpacity
          style={[MapScreenStyles.MyLocationBtsn, styles.NoFlexDirectionCenter]}
          onPress={() => {
            moveToMyLocation();
          }}>
          <MaterialIcons name="my-location" size={27} color="#6713D2" />
        </TouchableOpacity>
      </View>

      {/* {location && (
        <TouchableOpacity style={[MapScreenStyles.StartView, styles.NoFlexDirectionCenter,]}>
          <Text style={{color:'white'}}>{location.latitude}</Text>
          <Text style={{color:'white'}}>{location.longitude}</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default withAppContext(MapScreen);
