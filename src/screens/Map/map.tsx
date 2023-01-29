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
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  AppState,
  FlatList,
  RefreshControl,
  Switch,
  Pressable,
} from 'react-native';

import {MapScreenStyles} from '~/MapScreen';

import styles from '~/ManToManBoard';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import codePush from 'react-native-code-push';
import {useQuery} from 'react-query';

import {firebase} from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';

import MapView, {LocalTile, Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import firestore from '@react-native-firebase/firestore';
import AntDesgin from 'react-native-vector-icons/AntDesign';

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
import {isEmptyObj} from '../../UsefulFunctions/isEmptyObj';

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
  M3TopBackgroundSvg,
  M3TopSvg,
  M3Main_TopBarSvg,
  Pay_PutoffSvg,
  Pay_HalfSvg,
  ClickedPay_HalfSvg,
} from 'component/Map/MapSvg';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CheckSvg,
  ClickedCompleteSvg,
  CompleteSvg,
  MinusSvg,
  PaySvg,
  PeopleAddSvg,
  PeopleSvg,
  PlusSvg,
  VerticalLineSvg,
} from 'component/General/GeneralSvg';
import {M5ChatSvg} from 'component/Chat/ChatSvg';
import channel from 'component/channel';
import {Type2VerticalLine} from 'component/LinearGradient/LinearGradientCircle';
export interface ILocation {
  latitude: number;
  longitude: number;
}

interface ProfileForGtoM {
  ProfileImageUrl: string;
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
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
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
      console.log('you can use the location');
    } else {
      console.log('Location Permission denied');
    }
  } catch (err) {
    console.log(err);
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
        console.log(successtring);
      } catch (err) {
        console.log('error:', err.message);
        console.log(`${errstring}`);
      }
    },
    (error) => {
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 300000, maximumAge: 10000},
  );
};

const ShowManLocationForGM = async (
  UserEmail: string,
  ProfileImageUrl: string,
  NickName: string,
  Mbti: string,
) => {
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  let id = setInterval(() => {
    const EpochTime = +new Date();

    const UpdateManLocation = (latitude: any, longitude: any) => {
      reference.ref(`/ManLocation/${ReplaceUserEmail}`).update({
        latitude: latitude,
        longitude: longitude,
        ProfileImageUrl: ProfileImageUrl,
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
  //   console.log("Man")
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
  CanPayit: Number,
  ProfileImageUrl: any,
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
        TimeStamp: EpochTime,
        UserEmail: UserEmail,
        NickName: NickName,
        Mbti: Mbti,
      })
      .then(() => DeleteMyLocationAfter3Min(ReplaceUserEmail, 2));
  };

  GetMyCoords(UpdateGirlLocation, 'Girl_StartShowLocation Function');
};
const logout = (navigation: any, SendBird: any) => {
  RemoveIdentityToken();
  SendBird.disconnect();
  navigation.navigate('ValidInvitationCodeScreen');
};
const RemoveIdentityToken = async () => {
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
  console.log('AndroidPushNoti');

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
      console.log('state location change');
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 2,
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
        console.log('InviObj:', InviObj);

        return InviObj;
      })
      .then((InvitationCodeToFriend) => {
        console.log('InvitationCodeToFriend:', InvitationCodeToFriend);

        setInvitationCodeToFriend(InvitationCodeToFriend);
      });
  };

  const [locationState, locationdispatch] = useReducer(locationReducer, {
    latlng: {},
  });

  const [token, setToken] = useState('');

  const onRegister = (tk: string) => {
    console.log('[App] onRegister : token :', tk);
    if (tk) setToken(tk);
  };
  // notify를 인수로 받아
  // notify의 title, body, notify를
  const onNotification = (notify: any) => {
    console.log('[App] onNotification : notify :', notify);

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
    console.log('[App] onOpenNotification : notify :', notify);
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

      // 현재위치를 state화 &추적

      // UpdateMyLocationWatch(setLocation, locationdispatch);
      UpdateMyLocationWatch(locationdispatch);

      if (UserData.Gender == '1') {
        let Result = ShowManLocationForGM(
          UserData.UserEmail,
          UserData.ProfileImageUrl,
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

    const onChildAdd = reference
      .ref('/Location')
      .on('child_added', (snapshot) => {
        GirlsLocationsrefetch();
      });

    const onChildRemove = database()
      .ref('/Location')
      .on('child_removed', (snapshot) => {
        console.log(snapshot);
        GirlsLocationsrefetch();
      });

    const ManonChildAdd = database()
      .ref('/ManLocation')
      .on('child_added', (snapshot) => {
        MansLocationsretech();
      });

    // console.log("AppState In MapScreen:", AppState.currentState)
    // console.log("appState.current", appState.current);

    // const subscription = AppState.addEventListener("change", (nextAppState) => {
    //   if (
    //     appState.current.match(/inactive|background/) &&
    //     nextAppState === "active"
    //   ) {
    //     // console.log("appState.current2",appState.current)
    //     console.log("App has come to the foreground!");
    //   } else if(appState.current.match(/active/) && nextAppState === "background") {
    //     console.log("App has come to the background")
    //     // SendBird.disconnect()
    //   }
    //     appState.current = nextAppState;
    //     console.log("AppState", nextAppState);

    //   })

    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    // Stop listening for updates when no longer required
    return () => {
      reference.ref('/Location').off('child_added', onChildAdd);
      reference.ref('/ManLocation').off('child_added', ManonChildAdd);
      reference.ref('/Location').off('child_moved', onChildRemove);

      unsubscribe.remove();
      // clearInterval(Result)
      SendBird.removeConnectionHandler('channels');
      SendBird.removeChannelHandler('channels');
      // unsubscribe.remove();
      // subscription.remove();
    };
  }, []);

  /// on connection event

  const handleStateChange = (newState: any) => {
    // ios - active - inactive
    // aos - active - background니
    // active를 기준으로 나눠주면 나누면 두 운영체제 모두 포함하는 코드가 된다.
    console.log('handleStateChange');
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

  const StopShowMyLocationMan = () => {
    setGpsOn((previousState) => !previousState);
  };

  const [GpsOn, setGpsOn] = useState(UserData.Gender == 1);

  const [ModalVisiable, setModalVisiable] = useState(false);
  const [ProfileModalVisiable, setProfileModalVisiable] = useState(false);
  const [ShowUserModal, setShowUserModal] = useState(false);

  const [ProfileForGtoM, setProfileForGtoM] = useState<Object>({});

  const [Memo, setMemo] = useState('');
  const [PeopleNum, setPeopleNum] = useState(1);
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
    console.log(day);
    // day가 오후 10시 ~ 새벽 7시
    if ((day >= 22 && day <= 24) || (day >= 1 && day <= 7)) {
      Girl_StartShowLocation(
        UserData.UserEmail,
        Memo,
        PeopleNum,
        MoenyRadioBox,
        UserData.ProfileImageUrl,
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

  const Stateize = async (Obj: ProfileForGtoM) => {
    setProfileForGtoM(Obj);
  };

  const GirlMarkerOnPress = async (Obj: ProfileForGtoM) => {
    await Stateize(Obj);
    SwitchShowUserModal();
  };

  const DeleteChannelAfter10Minutes = (Channel: Object) => {
    console.log('ChannelUrl In DeleteChannelAfter10Minutes:', Channel.url);
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
    console.log('StartChatingBetweenGirls In TwoMapScreen');
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
            console.log(error.message);
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

            console.log(
              'groupChannel In CreateChating Function In MapScreen:',
              groupChannel,
            );
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
    console.log(region);
    mapRef.current.animateToRegion(region);
    console.log('[MapScreen] moveToMyLocation called');
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

  const MainImage = (
    <Image
      resizeMode="cover"
      source={{uri: ProfileForGtoM?.ProfileImageUrl}}
      style={{
        width: '95%',
        marginLeft: '2.5%',
        height: '81%',
        borderRadius: 31,
        marginTop: 10,
      }}></Image>
  );

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
        {PaySvg(22)}
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
        onSwipeComplete={() => setShowUserModal(false)}
        swipeDirection="down">
        <View
          style={[
            styles.W95ML5,
            {height: '65%', backgroundColor: '#313A5B', borderRadius: 26},
          ]}>
          {MainImage}
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
              </Text>
              <Text style={{color: 'white', marginTop: 5, fontWeight: '400'}}>
                {ProfileForGtoM.Mbti}
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
            <View
              style={{
                width: '100%',
                height: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 2,
                  width: 80,
                  backgroundColor: 'gray',
                  borderRadius: 25,
                }}
              />
            </View>

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
          height: '21%',
        },
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={{marginBottom: 10}}>인원</Text>
        <View style={[MapScreenStyles.PeopleNumOption]}>
          {PeopleSvg(width * 0.08, {marginLeft: 10})}
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

  const M3Main_FriendSelect = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        styles.W100H20,
        {backgroundColor: 'skyblue'},
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}

        {CheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={{marginBottom: 10}}>인원 추가</Text>
        <View style={[MapScreenStyles.FriendAdd]}>
          {PeopleAddSvg(width * 0.08, {marginLeft: 10, marginRight: 10})}
          <TextInput
            value={Memo}
            onChangeText={(text) => setMemo(text)}
            style={MapScreenStyles.MemoTextInput}></TextInput>
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

  const M3Main_PaySelect = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        styles.W100H20,
        {backgroundColor: 'orange'},
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {/* {Type2VerticalLine('100%')} */}

        {/* {CheckSvg(22)} */}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <View style={[MapScreenStyles.PayOption]}>
          <TouchableOpacity onPress={() => OnePress()}>
            {Pay_PutoffSvg(50)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => TwoPress()}>
            {MoenyRadioBox == 2 ? ClickedPay_HalfSvg(50) : Pay_HalfSvg(50)}
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
            // top: '-5%',
            right: '5%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginTop: 0,
            marginBottom: 0,
            backgroundColor: 'gray',
          },
        ]}>
        <SafeAreaView>{M3TopSvg(width)}</SafeAreaView>
        {/* <View
          style={{
            marginLeft: '8%',
            marginTop: '8%',
          }}>
          {M3Main_TopBarSvg(width * 0.84)}
        </View> */}

        <View
          style={{
            width: '84%',
            height: '55%',
            marginLeft: '8%',
            marginTop: '-3%',
            backgroundColor: '#37375B',
            borderBottomEndRadius: 48,
            borderBottomStartRadius: 48,
          }}>
          {M3Main_PeopleNumSelect}
          {M3Main_PeopleNumSelect}
          {M3Main_FriendSelect}
          {M3Main_PaySelect}
          <View
            style={[
              styles.Row_OnlyColumnCenter,
              styles.W100H20,
              {backgroundColor: 'pink'},
            ]}>
            <TouchableOpacity
              style={[styles.RowCenter, MapScreenStyles.CancelBoxView]}
              onPress={() => {
                ChangeModalVisiable();
              }}>
              <Text>취소</Text>
            </TouchableOpacity>

            {Memo == '' && MoenyRadioBox != 0 ? (
              <TouchableOpacity
                style={MapScreenStyles.CheckBoxView}
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
                  {backgroundColor: '#DFE5F1'},
                ]}>
                <Text>완료</Text>
              </View>
            )}
          </View>
        </View>
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

  const GpsOnOffSwitch = (onValueChangeFun: Function) => {
    return (
      <Switch
        trackColor={{false: '#202124', true: '#202124'}}
        thumbColor={GpsOn ? '#28FF98' : '#f4f3f4'}
        ios_backgroundColor="#202124"
        onValueChange={onValueChangeFun}
        value={GpsOn}
      />
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

  const GirlTabBar = () => {
    return (
      <SafeAreaView
        style={[styles.Row_OnlyColumnCenter, MapScreenStyles.TopView]}>
        <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>
          나의위치 표시하기
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: GpsOn == false ? '#9F9F9F' : '#28FF98',
          }}>
          {Math.floor(second / 60)} : {second % 60}
        </Text>

        {GpsOn == true ? GpsOnOffSwitch(StopShowMyLocation) : null}

        {GpsOn == false ? View_GpsOff() : View_GpsOn()}
      </SafeAreaView>
    );
  };

  const ManTabBar = () => {
    return (
      <SafeAreaView
        style={[styles.Row_OnlyColumnCenter, MapScreenStyles.TopView]}>
        <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>
          나의위치 표시하기
        </Text>
        {GpsOnOffSwitch(StopShowMyLocationMan)}

        {GpsOn == false ? View_GpsOff() : View_GpsOn()}
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
          navigation.navigate('FriendMapScreen', {
            UserData,
          });
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
        {Btn_EnterFriendMap()}
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
        {Btn_EnterFriendMap()}
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

          {/* {isLoading == false && UserData.Gender == 2 && GpsOn == true */}
          {isLoading == false
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
            // navigation.navigate('MyProfileScreen', {
            //   UserData,
            // });
            setProfileModalVisiable(true);
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

export default withAppContext(codePush(MapScreen));
