import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useReducer,
  memo,
  useCallback,
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
  ImageBackground,
} from 'react-native';

import {MapScreenStyles} from '~/MapScreen';
import styles from '~/ManToManBoard';

import {useQuery} from 'react-query';

import {firebase} from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';

import MapView, {
  Circle,
  LocalTile,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

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
  M3Main_TopBarWhiteHeartSvg,
  EventBtnSvg,
} from 'component/Map/MapSvg';

import {
  CheckSvg,
  ClickedCheckSvg,
  ClickedCompleteSvg,
  ColorPeopleSvg,
  DdayBtnSvg,
  MemoSvg,
  MinusSvg,
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
import {
  GetBlurNum,
  GetFriendProfileImage,
  GetUserNickNameList,
} from '^/Firebase';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import {background} from 'native-base/lib/typescript/theme/styled-system';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {HPer90, WPer15, WPer30, WPer90} from '~/Per';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'native-base';
import {Btn_ClickableNext, MainColorBtn_Clickable} from 'component/Profile';
import {RequestAttendFirstEvent} from '../../Firebase/create';
import {
  Get_EventAttendedUserDataList,
  Get_EventAttendedUserEmailList,
} from '../../Firebase/get';
import {FirstEventInviteCopyRight} from 'Assets/Event';

import {
  AlreadyAttendModal,
  ChooseModal,
  CompleteAttendFirstEventModal,
} from 'component/ReUseModal';
import {WithLocalSvg} from 'react-native-svg';
import {MyProfileStyles} from '~/MyProfile';
import X from 'Assets/X.svg';
import {Success} from '^/NoMistakeWord';
import {SpecificLatLng} from '^/utils';
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

export interface UserData {
  FriendMbti: string;
  UserEmail: string;
  NickName: string;
  Mbti: string;
  ProfileImageUrl: string;
  ProfileImageUrl2: string;
  ProfileImageUrl3: string;
  ProfileImageUrl4: string;
  ProfileImageUrl5: string;
  ProfileImageUrl6: string;
}

const HypeSeoullatitude = 37.5261485;
const HypeSeoullongitude = 127.0385686;

export const reference = firebase
  .app()
  .database(
    'https://hunt-d7d89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );

const GetDistanceBetweenTwoPoint = (
  StartLongitude: number,
  StartLatitude: number,
) => {
  const options = {
    headers: {
      accept: 'application/json',
      appKey: 'l7xxc0de921a2f044ca9b5a4902ed4b9bcdb',
    },
  };

  return axios
    .get(
      `https://apis.openapi.sk.com/tmap/routes/distance?version=1&startX=${StartLongitude}&startY=${StartLatitude}&endX=${HypeSeoullongitude}&endY=${HypeSeoullatitude}&reqCoordType=WGS84GEO`,
      options,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('error ' + error);
    });
};

const CheckIn1km = async (StartLongitude: number, StartLatitude: number) => {
  const Distance = await GetDistanceBetweenTwoPoint(
    StartLongitude,
    StartLatitude,
  );

  const DistanceValue = Distance.distanceInfo.distance;

  if (DistanceValue <= 100000) {
    return true;
  } else if (DistanceValue > 100000) {
    return false;
  }
};
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
        console.log(successtring);
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
  ManFriendData: Object,
) => {
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  let id = setInterval(() => {
    const EpochTime = +new Date();
    let PeopleNum: number;
    {
      ManFriendData.NickName != '' ? (PeopleNum = 2) : (PeopleNum = 1);
    }

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
        FriendProfileImageUrl: ManFriendData.ProfileImageUrl,
        FriendProfileImageUrl2: ManFriendData.ProfileImageUrl2,
        FriendMbti: ManFriendData.Mbti,
        FriendNickName: ManFriendData.NickName,
        TimeStamp: EpochTime,
        NickName: NickName,
        Mbti: Mbti,
        PeopleNum: PeopleNum,
      });
    };

    GetMyCoords(
      UpdateManLocation,
      'ManLocationUdpate Function',
      // 'ManLocationForeGroundUpdate',
    );
  }, 5000);

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

const DirectDeleteMyLocation = (UserEmail: string, Path: string) => {
  let ReplaceUserEmail = ReplacedotInEmail(UserEmail);
  reference.ref(`/${Path}/${ReplaceUserEmail}`).remove();
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

  if (FriendData == undefined) {
    Alert.alert('입력된 사용자는 존재하지 않습니다.');
    return;
  }

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

  let date = new Date();
  let ToDay = date.getDate();
  let FirstEventLastDay = 7 - ToDay;

  const PosterPreload = require('../../Assets/FirstEvent/FirstEventPoster.svg');

  const UserData = props.route.params.UserData;

  const navigation = useNavigation();

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const {width, height} = Dimensions.get('window');

  const H11 = height * 0.11;
  const mapRef = useRef(null);

  const [location, setLocation] = useState<ILocation | undefined>(undefined);

  const [InvitationCodeToFriend, setInvitationCodeToFriend] = useState([]);

  const GetInvitationCodeUsed = (InvitationCodeToFriend: String) => {
    return firestore()
      .collection('InvitationCodeList')
      .where('InvitationCode', '==', InvitationCodeToFriend)
      .get()
      .then((querySnapshot) => {
        let Used;
        querySnapshot.forEach((doc) => {
          Used = doc.data().Used;
        });
      });
  };

  const GetInvitationToFriendObj = async (
    InvitationCodeToFriend: Array<string>,
  ) => {
    const Used1 = GetInvitationCodeUsed(InvitationCodeToFriend[0]);
    const Used2 = GetInvitationCodeUsed(InvitationCodeToFriend[1]);

    let Obj1 = {
      InvitationCode: InvitationCodeToFriend[0],
      Used: Used1,
    };

    let Obj2 = {
      InvitationCode: InvitationCodeToFriend[1],
      Used: Used2,
    };

    let Array: Array<Object> = [Obj1, Obj2];

    return Array;
  };
  const GetInvitationToFriendCode = async () => {
    if (UserData.InvitationCodeToFriend == null) {
      return;
    }

    const InvitationCodeToFriend = UserData.InvitationCodeToFriend;
    let InviObj: Array<Object> = await GetInvitationToFriendObj(
      InvitationCodeToFriend,
    );
    setInvitationCodeToFriend(InviObj);
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

  const [FirstEventAttendedUserList, setFirstEventAttendedUserList] = useState(
    [],
  );

  const [FirstEventBlurNum, setFirstEventBlurNum] = useState(50);
  const [FirstEventBlurDday, setFirstEventBlurDday] = useState(3);

  const [IsAttendedFirstEvent, setIsAttendedFirstEvent] = useState(false);

  useEffect(() => {
    const SaveInDevice = async () => {
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
      await GetInvitationToFriendCode();
      await GetAsyncStorageEmail();
    };

    let Result = SaveInDevice();

    GetBlurNum().then((BlurObj) => {
      const BlurNum = BlurObj?.BlurNumber;
      const BlurDday = BlurObj?.ProfileViewDday;

      setFirstEventBlurNum(BlurNum);
      setFirstEventBlurDday(BlurDday);
    });

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
      clearInterval(Result);
      // subscription.remove();
    };
  }, []);

  const [
    FirstEventAttendCongratulateModalVis,
    setFirstEventAttendCongratulateModalVis,
  ] = useState(false);

  useEffect(() => {
    Get_EventAttendedUserDataList(UserData.Gender).then(
      (AttendedUserDataList) => {
        const gridData = [];

        while (AttendedUserDataList.length) {
          gridData.push(AttendedUserDataList.splice(0, 3));
        }
        setFirstEventAttendedUserList(gridData);
      },
    );

    Get_EventAttendedUserEmailList().then((AttendedUserEmailList) => {
      if (AttendedUserEmailList.includes(UserData.UserEmail)) {
        setIsAttendedFirstEvent(true);
      }
    });
  }, [FirstEventAttendCongratulateModalVis]);

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

  const [ManFriendData, setManFriendData] = useState({
    ProfileImageUrl: '',
    ProfileImageUrl2: '',
    Mbti: '',
    NickName: '',
  });

  const StopShowMyLocation = () => {
    setGpsOn((previousState) => !previousState);
    setSecond(180);
    DirectDeleteMyLocation(UserData.UserEmail, 'Location');
  };

  const ChangeShowStateMan = () => {
    // Alert.alert(
    //   '남성유저 160명, 여성유저 200명이 가입하기 전까진 사용할 수 없습니다',
    // );
    // return;

    // setWaitModalVis(true);
    // navigation.navigate('WaitScreen');
    // return;
    if (IsAttendedFirstEvent) {
      Alert.alert('이벤트 참가 중에는 해당 기능을 사용할수 없어요!');
      return;
    }

    setGpsOn((previousState) => !previousState);
  };

  const [GpsOn, setGpsOn] = useState(false);

  const [ModalVisiable, setModalVisiable] = useState(false);

  const [ProfileModalVisiable, setProfileModalVisiable] = useState(false);
  const [WaitModalVis, setWaitModalVis] = useState(false);
  const [FirstEventModalVis, setFirstEventModalVis] = useState(false);
  const [FirstEventAttendedUserModalVis, setFirstEventAttendedUserModalVis] =
    useState(false);

  const [FirstEventAttendModalVis, setFirstEventAttendModalVis] =
    useState(false);

  const [AlreadyAttendModalVis, setAlreadyAttendModalVis] = useState(false);

  const [ShowUserModal, setShowUserModal] = useState(false);
  const [ShowFirstEventUserModal, setShowFirstEventUserModal] = useState(false);

  const [ProfileForGtoM, setProfileForGtoM] = useState<Object>({});

  const [Memo, setMemo] = useState('');
  const [FriendEmail, setFriendEmail] = useState<string>('');
  const [ManFriendEmail, setManFriendEmail] = useState<string>('');

  const [PeopleNum, setPeopleNum] = useState(2);
  const [ManPeopleNum, setManPeopleNum] = useState(1);

  const [MoenyRadioBox, setMoneyRadioBox] = useState(0);

  const [second, setSecond] = useState<number>(180);

  const ChangeModalVisiable = () => {
    setModalVisiable((previousState) => !previousState);
  };

  const [lastIntervalId, setlastIntervalId] = useState<NodeJS.Timer>();

  useEffect(() => {
    if (UserData.Gender == 1 && GpsOn == true) {
      clearInterval(lastIntervalId);
      ShowManLocationForGM(
        UserData.UserEmail,
        UserData.ProfileImageUrl,
        UserData.ProfileImageUrl2,
        UserData.ProfileImageUrl3,
        UserData.ProfileImageUrl4,
        UserData.ProfileImageUrl5,
        UserData.ProfileImageUrl6,
        UserData.NickName,
        UserData.Mbti,
        ManFriendData,
      ).then((id) => {
        console.log('then id [MapScreen UseEffect Gpson True]', id);
        setlastIntervalId(id);
      });
    }

    if (UserData.Gender == 1 && GpsOn == false) {
      console.log(
        'lastIntervalId [MapScreen UseEffect Gpson false]',
        lastIntervalId,
      );
      DirectDeleteMyLocation(UserData.UserEmail, 'ManLocation');

      clearInterval(lastIntervalId);
    }
  }, [GpsOn, ManFriendData]);

  const DecreaseSecond = useCallback(() => {
    setSecond(second - 1);
  }, []);

  Counter(
    () => {
      if (GpsOn == true) {
        // useCallback(() => {
        //   setSecond(second - 1);
        // }, []);
        DecreaseSecond();
      }
    },
    second >= 1 ? 1000 : null,
    () => {
      setSecond(180);
      setGpsOn(false);
    },
  );

  const ProfileNullCheck = (ProfileImage: string) => {
    if (ProfileImage == '') {
      return false;
    } else {
      return true;
    }
  };

  const WarnProfileNull = () => {
    Alert.alert('프로필 사진을 입력해주세요');
  };

  const ShowMyLocation = async () => {
    // Alert.alert(
    //   '남성유저 160명, 여성유저 200명이 가입하기 전까진 사용할 수 없습니다',
    // );
    // return;
    if (IsAttendedFirstEvent) {
      Alert.alert('이벤트 참가 중에는 해당 기능을 사용할수 없어요!');
      return;
    }

    const ProfileCheck = ProfileNullCheck(UserData.ProfileImageUrl);
    if (ProfileCheck == false) {
      WarnProfileNull();
      return;
    }

    const date = new Date();
    let day = date.getHours();
    day = 23;
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

      if (FriendEmail != '') {
        const FriendData = await GetFriendProfileImage(FriendEmail);
        console.log('FriendData:', FriendData);
        if (FriendData != undefined) {
          setManFriendData(FriendData);
        }
      }
    } else {
      Alert.alert('10시부터 새벽7시까지 이용 가능합니다.');
    }
  };

  const ManTagFriend = async (ManFriendEmail: string) => {
    ChangeEnter_TagFriendModal();
    const FriendData: any = await GetFriendProfileImage(ManFriendEmail);
    console.log('FriendData In ManTagFriend Fun:', FriendData);

    if (FriendData) {
      setManFriendData(FriendData);
    } else {
      Alert.alert('사용자가 존재하지 않음');
    }
  };

  const SwitchShowUserModal = () => {
    setShowUserModal(!ShowUserModal);
  };

  const SwitchFirstEventShowUserModal = () => {
    setShowFirstEventUserModal(!ShowFirstEventUserModal);
  };

  const [ShowMbti, setShowMbti] = useState('');
  const [ShowNickName, setShowNickName] = useState('');

  const Stateize = async (Obj: ProfileForGtoM) => {
    setProfileForGtoM(Obj);
    // setShowMbti(Obj.Mbti);
    // setShowNickName(Obj.NickName);

    // console.log('stateize');
  };

  const GirlMarkerOnPress = async (
    Obj: ProfileForGtoM,
    IsFirstEvent: boolean,
  ) => {
    await Stateize(Obj);

    if (IsFirstEvent == true) {
      SwitchFirstEventShowUserModal();
    } else {
      SwitchShowUserModal();
    }
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

  const CreateChating = async () => {
    const ProfileCheck = ProfileNullCheck(UserData.ProfileImageUrl);
    if (ProfileCheck == false) {
      WarnProfileNull();
      return;
    }
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
        async function (groupChannel: any, error: Error) {
          if (error) {
            // console.log(error.message);
            // Handle error.
          } else if (!error) {
            SwitchShowUserModal();
            await CreateCanSendMetaData(
              groupChannel,
              OtherMetadDataKey,
              ProfileForGtoM.UserEmail,
              MyMetadDataKey,
              UserData.UserEmail,
            );
            chat(groupChannel);
          }
        },
      );
    }
  };

  const FirstEventCreateChating = async () => {
    const ProfileCheck = ProfileNullCheck(UserData.ProfileImageUrl);
    if (ProfileCheck == false) {
      WarnProfileNull();
      return;
    }

    let params = new SendBird.GroupChannelParams();

    // 추가로 고려할거 : 이미 채팅하기를 눌러 채팅방이 생성된 상태와 처음 채팅하기를 눌러서 채팅방이 생성되는 상황을 분기처리 하기
    if (isEmptyObj(ProfileForGtoM) == false) {
      let Member = [ProfileForGtoM.UserEmail, UserData.UserEmail];
      let NickNames = [ProfileForGtoM.NickName, UserData.NickName];

      params.addUserIds(Member);
      params.coverUrl = ProfileForGtoM.ProfileImageUrl;
      params.name = NickNames[0];
      params.operatorUserIds = Member;
      (params.isDistinct = true), (params.isPublic = false);

      SendBird.GroupChannel.createChannel(
        params,
        function (groupChannel: any, error: Error) {
          if (error) {
            // console.log(error.message);
            // Handle error.
          } else if (!error) {
            SwitchFirstEventShowUserModal();
            FirstEventGochatScreen(groupChannel);
          }
        },
      );
    }
  };

  const CreateCanSendMetaData = async (
    channel: any,
    OtherMetadDataKey: string,
    OtherUserEmail: string,
    MyMetaDataKey: string,
    MyEmail: string,
  ) => {
    const GetMetaDataResult = await channel.getMetaData([MyMetaDataKey]);

    if (Object.getOwnPropertyNames(GetMetaDataResult).length === 0) {
      let Metadata = {
        [OtherMetadDataKey]: '0',
        [MyMetaDataKey]: '0',
      };
      await channel.createMetaData(Metadata);
      return;
    } else {
      return;
    }

    // channel.createMetaData(Metadata, function (response: any, error: Error) {
    //   if (error) {
    //     // Handle error.
    //   } else {
    //     console.log('createMetaData res:', response);
    //   }
    // });
  };

  const chat = (channel: any) => {
    navigation.navigate('ChatScreen', {
      channel,
      UserData,
    });
  };
  const FirstEventGochatScreen = (channel: any) => {
    navigation.navigate('NoTimeLimitChatScreen', {
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

  const AnimationMarker = () => {
    return (
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}>
        <View style={[MarkerAnimationStyles.dot, styles.RowCenter]}>
          {[...Array(3).keys()].map((_, index) => (
            <Ring key={index} index={index} />
          ))}
          <Image
            style={MarkerAnimationStyles.Image}
            source={{uri: UserData.ProfileImageUrl}}
          />
          {ManFriendData.NickName != '' ? (
            <Image
              style={MarkerAnimationStyles.SecondImage}
              source={{uri: ManFriendData.ProfileImageUrl}}
            />
          ) : null}
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

  const ManMinusIcon = (
    <TouchableOpacity
      onPress={() => {
        if (ManPeopleNum > 1) {
          setManPeopleNum(ManPeopleNum - 1);
        }
      }}>
      {MinusSvg(30)}
    </TouchableOpacity>
  );

  const ManPlusIcon = (
    <TouchableOpacity
      onPress={() => {
        if (ManPeopleNum < 1) {
          setManPeopleNum(ManPeopleNum + 1);
        }
      }}>
      {PlusSvg(30)}
    </TouchableOpacity>
  );

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

  const [FiliterImageArray, setFiliterImageArray] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  useEffect(() => {
    const ImageArray = [
      ProfileForGtoM.ProfileImageUrl,
      ProfileForGtoM.FriendProfileImageUrl,
      ProfileForGtoM.ProfileImageUrl2,
      ProfileForGtoM.FriendProfileImageUrl2,
      ProfileForGtoM.ProfileImageUrl3,
      ProfileForGtoM.ProfileImageUrl4,
      ProfileForGtoM.ProfileImageUrl5,
      ProfileForGtoM.ProfileImageUrl6,
    ];
    const FiliterImageArray = ImageArray.filter((data: any) => {
      return data != undefined && data != '';
    });

    setFiliterImageArray(FiliterImageArray);
  }, [ProfileForGtoM]);

  const MainImage = (
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

  const MainImageFlat = (
    <View
      style={{
        width: '95%',
        marginLeft: '2.5%',
        height: '81%',
        borderRadius: 31,
        marginTop: 10,
      }}>
      <SwiperFlatList
        showPagination={true}
        data={FiliterImageArray}
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
        paginationStyleItem={{
          height: '100%',
          width: `${100 / FiliterImageArray.length}%`,
          backgroundColor: '#00000014',
          borderRadius: 4,
        }}
        paginationStyleItemActive={{
          height: '100%',
          width: `${100 / FiliterImageArray.length}%`,
          backgroundColor: 'white',
          borderRadius: 4,
        }}
        renderItem={({item}) => (
          <Image
            // key={index}
            resizeMode="cover"
            style={{
              width: width * 0.855,
              height: '100%',
              borderRadius: 31,
            }}
            source={{
              uri: item,
            }}
          />
        )}
      />
    </View>
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

  const FirstEventChatView = (
    <View style={MapScreenStyles.ChatView}>
      <TouchableOpacity onPress={() => FirstEventCreateChating()}>
        {M5ChatSvg(width * 0.17)}
      </TouchableOpacity>
    </View>
  );

  const ImageBar = (
    <View style={MapScreenStyles.ImageBar}>
      {/* <View style={MapScreenStyles.ImageBarBox}>
        {PaySvg(22)}
        <Text style={styles.WhiteColor}>비용</Text>
        <Text style={MapScreenStyles.ImageBarText}>
          {ProfileForGtoM.CanPayit}
        </Text>
      </View> */}
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
            {height: '65%', backgroundColor: '#313A5B', borderRadius: 26},
          ]}>
          {ProfileForGtoM.ProfileImageUrl != undefined ? MainImageFlat : null}
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
                {ProfileForGtoM?.Mbti}
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

  const FirstEventClickedUserDataModal = () => {
    return (
      <Modal
        animationIn="slideInUp"
        isVisible={ShowFirstEventUserModal}
        coverScreen={false}
        onBackdropPress={() => SwitchFirstEventShowUserModal()}>
        <View
          style={[
            {height: '65%', backgroundColor: '#313A5B', borderRadius: 26},
          ]}>
          {ProfileForGtoM.ProfileImageUrl != undefined ? MainImageFlat : null}

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
                {ProfileForGtoM.NickName}
              </Text>
              <Text style={{color: 'white', marginTop: 5, fontWeight: '400'}}>
                {/* {ShowMbti} */}
                {ProfileForGtoM?.Mbti}
              </Text>
              <Text
                style={{color: 'white', marginTop: 5, fontWeight: '400'}}
                numberOfLines={2}>
                {ProfileForGtoM.Age}
                {ProfileForGtoM.Memo}
              </Text>
            </View>
          </View>
          {FirstEventChatView}
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

  const M3Main_ManPeopleNumSelect = (
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
        {ManPeopleNum == 0 ? CheckSvg(22) : ClickedCheckSvg(22)}
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
            {ManMinusIcon}
            <Text style={[MapScreenStyles.TotalPeopleNum]}>
              {ManPeopleNum}명
            </Text>
            {ManPlusIcon}
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
          {/* 랑데부 가입자가 아닌 유저일 시 닉네임을 입력해주세요 */}
          친구의 닉네임을 입력해주세요
        </Text>
      </View>
    </View>
  );

  const [selectedItem, setSelectedItem] = useState(null);

  const searchRef = useRef(null);
  const MansearchRef = useRef(null);

  const dropdownController = useRef(null);
  const MandropdownController = useRef(null);

  const M3Main_FriendEmail_Auto = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {
          height: H11,
          width: '100%',
          zIndex: 1,
        },
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
            onClear={() => {
              setFriendEmail('');
            }}
            initialValue={FriendEmail} // or just '2'
            onSelectItem={(item) => {
              item && // console.log(item.UserEmail);
                item &&
                setFriendEmail(item.UserEmail);
            }}
            onChangeText={(Text) => {
              console.log(Text);
              setFriendEmail(Text);
            }}
            dataSet={NickNameList}
            containerStyle={{flex: 1}}
            // ChevronIconComponent={
            //   <MaterialIcons name="my-location" size={27} color="#6713D2" />
            // }
            // ClearIconComponent={
            //   <MaterialIcons name="my-location" size={27} color="#6713D2" />
            // }
            keyExtractor={(item: any) => item.id}
          />
        </View>
        <View
          style={{
            width: '90%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 8,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 10,
              fontWeight: '500',
              color: '#DFE5F180',
              marginLeft: 10,
            }}>
            {/* 랑데부 가입자가 아닌 유저일 시 닉네임을 입력해주세요 */}
            친구의 닉네임을 입력해주세요
          </Text>
        </View>
      </View>
    </View>
  );

  const M3Main_ManFriendEmail_Auto = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {height: H11, width: '100%', zIndex: 1},
      ]}>
      <View style={MapScreenStyles.M3MainAside}>
        {Type2VerticalLine('100%')}

        {ManFriendEmail == '' ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>인원 추가</Text>
        <View style={[MapScreenStyles.FriendAdd]}>
          <AutocompleteDropdown
            ref={MansearchRef}
            useFilter={false}
            controller={(controller) => {
              MandropdownController.current = controller;
            }}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            // initialValue={{id: '2'}} // or just '2'
            onSelectItem={(item) => {
              item && // console.log(item.UserEmail);
                item &&
                setManFriendEmail(item.UserEmail);
            }}
            onChangeText={(Text) => {
              setManFriendEmail(Text);
            }}
            onClear={() => {
              setManFriendEmail('');
            }}
            dataSet={NickNameList}
            containerStyle={{flex: 1}}
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
          color: 'white',
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
          color: 'white',
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
        {Type2VerticalLine('50%')}
        {MoenyRadioBox == 0 ? CheckSvg(22) : ClickedCheckSvg(22)}
      </View>
      <View style={MapScreenStyles.M3MainSection}>
        <Text style={MapScreenStyles.M3MainSectionText}>비용</Text>

        <View style={[MapScreenStyles.PayOption]}>
          <TouchableOpacity
            style={{height: '100%', width: '40%'}}
            onPress={() => OnePress()}>
            {MoenyRadioBox == 1 ? M3Main_SelectedPayOption1 : M3Main_PayOption1}
          </TouchableOpacity>
          <TouchableOpacity
            style={{height: '100%', width: '40%'}}
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

  const Btn_ColorNext = (
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
        <Text style={[styles.WhiteColor]}>완료</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const Btn_NotColorNext = (
    <View
      style={[
        styles.RowCenter,
        MapScreenStyles.CheckBoxView,
        {backgroundColor: '#DFE5F1'},
      ]}>
      <Text>완료</Text>
    </View>
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
          styles.FullModal,
          {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
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
            {M3Main_TopBarWhiteHeartSvg(width * 0.116)}
          </View>

          <View
            style={{
              width: '84%',
              height: height * 0.55,
              marginLeft: '8%',
              // marginTop: '-2%',
              backgroundColor: '#37375B',
              borderBottomEndRadius: 48,
              borderBottomStartRadius: 48,
            }}>
            {M3Main_PeopleNumSelect}
            {PeopleNum >= 2 ? M3Main_FriendEmail_Auto : null}
            {M3Main_MemoInput}
            {/* {M3Main_PaySelect} */}
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

              {Memo != ''
                ? PeopleNum >= 2 && FriendEmail == ''
                  ? Btn_NotColorNext
                  : Btn_ColorNext
                : Btn_NotColorNext}
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
        {/* {Btn_RandomMatchComponent()} */}
        {ClickedBottomBar()}
        {/* </View> */}
      </Modal>
    );
  };

  const [ShowEnter_TagFriendModal, setShowEnter_TagFriendModal] =
    useState(false);
  const ChangeEnter_TagFriendModal = () => {
    setShowEnter_TagFriendModal(!ShowEnter_TagFriendModal);
  };

  const Enter_TagFriendModal = (
    <Modal
      animationIn="slideInUp"
      isVisible={ShowEnter_TagFriendModal}
      onBackdropPress={() => ChangeEnter_TagFriendModal()}
      coverScreen={false}
      style={[
        styles.W100H100,
        styles.FullModal,
        {
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        },
      ]}>
      <KeyboardAvoidingView
        contentContainerStyle={{
          flex: 1,
        }}
        behavior="position"
        enabled>
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
            height: height * 0.33,
            marginLeft: '8%',
            marginTop: '-3%',
            backgroundColor: '#37375B',
            borderBottomEndRadius: 48,
            borderBottomStartRadius: 48,
          }}>
          {M3Main_ManPeopleNumSelect}
          {M3Main_ManFriendEmail_Auto}
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
                ChangeEnter_TagFriendModal();
              }}>
              <Text>취소</Text>
            </TouchableOpacity>

            {ManFriendEmail != '' ? (
              <TouchableOpacity
                style={MapScreenStyles.CheckBoxView}
                onPress={() => {
                  ManTagFriend(ManFriendEmail);
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
          if (IsAttendedFirstEvent) {
            navigation.navigate('FirstEventChatListScreen', {
              UserData,
            });
          } else {
            navigation.navigate('ChatListScreen', {
              UserData,
            });
          }
        }}>
        {Enter_ChatSvg(80)}
      </TouchableOpacity>
    );
  };

  const Btn_ViewEventAttendedUser = () => {
    if (!IsAttendedFirstEvent) {
      return null;
    }

    return (
      <TouchableOpacity
        style={
          {
            // position: 'absolute',
            // bottom: '12%',
            // right: '5%',
          }
        }
        onPress={() => {
          setFirstEventAttendedUserModalVis(true);
        }}>
        {EventBtnSvg(80)}
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

  const Btn_EnterTagFriend = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          ChangeEnter_TagFriendModal();
          setManFriendEmail('');
        }}>
        {Enter_FriendMapSvg(80)}
      </TouchableOpacity>
    );
  };

  const ManFriendImage = (
    <TouchableOpacity
      onPress={() => {
        setManFriendData({
          ProfileImageUrl: '',
          ProfileImageUrl2: '',
          Mbti: '',
          NickName: '',
        });
        setFriendEmail('');
      }}>
      <Image
        source={{uri: ManFriendData.ProfileImageUrl}}
        style={{width: 80, height: 80, borderRadius: 40}}></Image>
    </TouchableOpacity>
  );

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
        {ManFriendData.NickName != '' ? ManFriendImage : null}
        {Btn_EnterChat()}
        {TouchableBtn_EnterMatch()}
        {Btn_ViewEventAttendedUser()}

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
        {ManFriendData.NickName != '' ? ManFriendImage : null}
        {Btn_EnterTagFriend()}
        {Btn_EnterChat()}
        {Btn_ViewEventAttendedUser()}

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
          console.log(FriendEmail);
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

  const Click_FirstEventMarker = () => {
    console.log('Click_FirstEventMarker');
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

  const ProfileImageBox = (
    <View
      style={[styles.NoFlexDirectionCenter, MapScreenStyles.ChangeProfileView]}>
      <TouchableOpacity
        style={[
          {
            backgroundColor: '#202632',
            borderRadius: 25,
            width: 46,
            height: 46,
          },
          styles.NoFlexDirectionCenter,
        ]}
        onPress={() => {
          navigation.navigate('MyProfileScreen', {
            UserData,
          });
        }}>
        {UserData.ProfileImageUrl == '' ? (
          <Ionicons name="person" size={40}></Ionicons>
        ) : (
          <Image
            source={{uri: UserData.ProfileImageUrl}}
            style={{width: 43, height: 43, borderRadius: 35}}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  const ProfileImageWithFriend = (
    <View style={[styles.RowCenter, MapScreenStyles.SecondChangeProfileView]}>
      <TouchableOpacity
        style={[styles.RowCenter]}
        onPress={() => {
          navigation.navigate('MyProfileScreen', {
            UserData,
          });
        }}>
        <Image
          source={{uri: UserData.ProfileImageUrl}}
          style={{width: 43, height: 43, borderRadius: 35}}
        />
        <Image
          source={{uri: ManFriendData.ProfileImageUrl}}
          style={{width: 43, height: 43, borderRadius: 35, marginLeft: -10}}
        />
      </TouchableOpacity>
    </View>
  );

  const WaitScreenModal = (
    <Modal
      animationIn={'slideInUp'}
      isVisible={WaitModalVis}
      onBackdropPress={() => setWaitModalVis(false)}
      style={[styles.FullModal, {width: '90%', right: 0}, styles.RowCenter]}>
      <TouchableOpacity onPress={() => setWaitModalVis(false)}>
        <Image
          style={{width: WPer90, height: HPer90}}
          source={require('../../Assets/WaitScreenBorder.png')}></Image>
      </TouchableOpacity>
    </Modal>
  );

  const CloseFirstEventModal = () => {
    setFirstEventModalVis(false);
  };

  const CloseFirstEventAttendedUserModal = () => {
    setFirstEventAttendedUserModalVis(false);
  };

  const ClickableImage_ForFirstEvent = ({ClickedUserData, setVis}: any) => (
    <TouchableOpacity
      onPress={() => {
        if (FirstEventLastDay <= FirstEventBlurDday) {
          setVis(false);
          GirlMarkerOnPress(ClickedUserData, true);
        }
      }}>
      <LinearGradient
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        colors={['#5B5AF3', '#5B59F3', '#835CF0', '#B567DB']}
        style={MyProfileStyles.linearGradient}>
        <ImageBackground
          source={{
            uri: ClickedUserData.ProfileImageUrl,
          }}
          style={MyProfileStyles.SubImage}
          blurRadius={FirstEventBlurNum >= 0 ? FirstEventBlurNum : 20}
          resizeMode="cover"
          imageStyle={{borderRadius: WPer15}}
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  const FirstEventAttendedUserGrid = ({setVis}: any) =>
    FirstEventAttendedUserList.map((data: any, rowIndex) => (
      <View
        style={[
          styles.Row_OnlyFlex,
          {width: '100%', justifyContent: 'space-around', marginBottom: 10},
        ]}
        key={rowIndex}>
        {data.map((item: any, columnIndex: number) => (
          <ClickableImage_ForFirstEvent
            ClickedUserData={item}
            setVis={setVis}
            key={item.UserEmail}
          />
        ))}
      </View>
    ));

  const Btn_FirstEventModalClose = ({setVis, MarginTop = '2.5%'}) => (
    <TouchableOpacity
      onPress={() => {
        setVis(false);
      }}
      style={{
        position: 'absolute',
        top: MarginTop,
        right: '5%',
        zIndex: 10,
      }}>
      <WithLocalSvg asset={X} />
    </TouchableOpacity>
  );

  const FirstEventModal = React.memo(({FirstEventModalVis}: any) => {
    return (
      <Modal
        animationIn={'slideInUp'}
        isVisible={FirstEventModalVis}
        onBackdropPress={() => CloseFirstEventModal()}
        style={[
          styles.FullModal,
          {
            width: '100%',
          },
        ]}>
        <SafeAreaView
          style={[
            {
              width: '100%',
              height: '90%',
            },
          ]}>
          <Btn_FirstEventModalClose setVis={setFirstEventModalVis} />

          <ScrollView
            contentContainerStyle={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            style={{
              backgroundColor: '#734FDA',
            }}>
            {/* <WithLocalSvg
            asset={PosterPreload}
            width={width * 1.1}
            style={{
              marginLeft: -2,
              marginTop: -10,
            }}
          /> */}
            <Image
              source={require('../../Assets/FirstEvent/FirstEventPoster.png')}
            />
            {/* {FirstEventSvg} */}

            {/* <Text>Fliter Location</Text> */}
            <View
              style={[
                styles.Row_OnlyColumnCenter,
                {
                  marginTop: '20%',
                  marginBottom: 16,
                  justifyContent: 'flex-end',
                  width: '90%',
                },
              ]}>
              <View style={[styles.RowCenter]}>
                <Text
                  style={{
                    position: 'absolute',
                    color: 'white',
                    zIndex: 1,
                    fontWeight: '600',
                    fontSize: 14,
                  }}>
                  {`D-${7 - ToDay}`}
                </Text>
                {DdayBtnSvg}
              </View>
              {/* <Text>7/4 일부터 모든 참가자들의 프로필 확인가능</Text> */}
            </View>

            {FirstEventAttendedUserList.length != 0 ? (
              <FirstEventAttendedUserGrid setVis={setFirstEventModalVis} />
            ) : null}

            {UserData.VisualMeasureStatus == Success ? (
              IsAttendedFirstEvent ? (
                <MainColorBtn_Clickable
                  style={{marginTop: 20}}
                  onPress={() => {
                    setFirstEventModalVis(false);
                    setTimeout(() => {
                      setAlreadyAttendModalVis(true);
                    }, 500);
                  }}
                  Title="참석 완료되었어요!"
                />
              ) : (
                <MainColorBtn_Clickable
                  style={{marginTop: 20}}
                  onPress={() => {
                    setFirstEventModalVis(false);
                    setTimeout(() => {
                      setFirstEventAttendModalVis(true);
                    }, 500);
                  }}
                  Title="참석 신청하기"
                />
              )
            ) : (
              <MainColorBtn_Clickable
                style={{marginTop: 20}}
                onPress={() => {}}
                Title="Ai 측정 전이에요!"
              />
            )}
          </ScrollView>
        </SafeAreaView>

        <TouchableOpacity
          onPress={() => CloseFirstEventModal()}></TouchableOpacity>
      </Modal>
    );
  });

  const FirstEventAttendedUserModal = (
    <Modal
      animationIn={'slideInUp'}
      isVisible={FirstEventAttendedUserModalVis}
      onBackdropPress={() => CloseFirstEventAttendedUserModal()}
      style={[
        styles.FullModal,
        {
          width: '100%',
          right: '5%',
        },
      ]}>
      <SafeAreaView
        style={[
          {
            backgroundColor: '#734FDA',
            width: '100%',
            height: '90%',
            borderRadius: 10,
          },
        ]}>
        <ScrollView
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Btn_FirstEventModalClose
            MarginTop="6%"
            setVis={setFirstEventAttendedUserModalVis}
          />

          <View
            style={[
              styles.Row_OnlyColumnCenter,
              {
                marginTop: '20%',
                marginBottom: 16,
                justifyContent: 'flex-end',
                width: '90%',
              },
            ]}>
            <View style={[styles.RowCenter]}>
              <Text
                style={{
                  position: 'absolute',
                  color: 'white',
                  zIndex: 1,
                  fontWeight: '600',
                  fontSize: 14,
                }}>
                {`D-${7 - ToDay}`}
              </Text>
              {DdayBtnSvg}
            </View>
            {/* <Text>7/4 일부터 모든 참가자들의 프로필 확인가능</Text> */}
          </View>
          {FirstEventAttendedUserList.length != 0 ? (
            <FirstEventAttendedUserGrid
              setVis={setFirstEventAttendedUserModalVis}
            />
          ) : null}
        </ScrollView>
      </SafeAreaView>

      <TouchableOpacity
        onPress={() => CloseFirstEventModal()}></TouchableOpacity>
    </Modal>
  );

  return (
    <View style={{width: '100%', height: '100%'}}>
      {/* 1. 내 프로필 정보를 보여주는 (GM3) 2. 클릭된 유저 정보를 보여주는(GM4) 3. 시작하기 클릭시 나오는 모달 */}
      {GirlInputStateModal()}
      {ShowClickedUserDataModal()}
      {FirstEventClickedUserDataModal()}
      {Enter_MatchModal()}
      {Enter_TagFriendModal}
      {WaitScreenModal}
      <FirstEventModal FirstEventModalVis={FirstEventModalVis} />
      {FirstEventAttendedUserModal}

      <ChooseModal
        Vis={FirstEventAttendModalVis}
        setVis={setFirstEventAttendModalVis}
        YesPressFun={() => {
          setFirstEventAttendModalVis(false);
          setTimeout(() => {
            setFirstEventAttendCongratulateModalVis(true);
          }, 500);
          RequestAttendFirstEvent(UserData);
          setIsAttendedFirstEvent(true);
        }}
        NoPressFun={() => {
          setFirstEventAttendModalVis(false);
        }}
        Title="파티에 참가하시겠습니까?"
      />
      <CompleteAttendFirstEventModal
        Vis={FirstEventAttendCongratulateModalVis}
        setVis={setFirstEventAttendCongratulateModalVis}
      />
      <AlreadyAttendModal
        Vis={AlreadyAttendModalVis}
        setVis={setAlreadyAttendModalVis}
      />

      {location && (
        <MapView
          style={{width: '100%', height: '100%'}}
          initialRegion={{
            // latitude: location.latitude,
            // longitude: location.longitude,
            latitude: HypeSeoullatitude,
            longitude: HypeSeoullongitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          //줌고정
          // zoomEnabled={false}
          // 카메라고정
          // scrollEnabled={false}
          ref={mapRef}
          showsUserLocation={true}
          loadingEnabled={true}
          // userInterfaceStyle="light"
          userInterfaceStyle="dark"
          minZoomLevel={10}
          // minZoomLevel={14}
          maxZoomLevel={17}
          // mapType="mutedStandard"
        >
          {GpsOn == true ? AnimationMarker() : null}
          {isLoading == false && UserData.Gender == 1 && GpsOn == true
            ? data?.map((data: any, index) => {
                return (
                  <Marker
                    key={data.latitude}
                    coordinate={{
                      latitude: data.latitude,
                      longitude: data.longitude,
                    }}
                    tracksViewChanges={false}
                    onPress={() => {
                      GirlMarkerOnPress(data, false);
                    }}>
                    <View style={[MarkerAnimationStyles.dot, styles.RowCenter]}>
                      {Platform.OS == 'ios'
                        ? [...Array(2).keys()].map((_, index) => (
                            <OtherRing key={index} index={index} />
                          ))
                        : null}

                      <Image
                        style={MapScreenStyles.MarkerImage}
                        source={{uri: data.ProfileImageUrl}}
                        resizeMode="cover"
                      />
                      {data?.FriendProfileImageUrl == '' ? null : (
                        <Image
                          style={MapScreenStyles.SecondMarkerImage}
                          source={{uri: data?.FriendProfileImageUrl}}
                          resizeMode="cover"
                        />
                      )}
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
                      GirlMarkerOnPress(MansData, false);
                    }}>
                    <View>
                      <Image
                        source={{uri: MansData.ProfileImageUrl}}
                        style={MapScreenStyles.MarkerImage}
                        resizeMode="cover"
                      />

                      {MansData?.FriendProfileImageUrl == '' ? null : (
                        <Image
                          style={MapScreenStyles.SecondMarkerImage}
                          source={{uri: MansData?.FriendProfileImageUrl}}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  </Marker>
                );
              })
            : null}

          {/* {itaewon_HotPlaceListisLoading == false
            ? HPMarker(itaewon_HotPlaceList)
            : null}

          {GangNam_HotPlaceListisLoading == false
            ? HPMarker(GangNam_HotPlaceList)
            : null}

          {Sinsa_HotPlaceListisLoading == false
            ? HPMarker(Sinsa_HotPlaceList)
            : null} */}
          <Marker
            key={'Dcruise'}
            coordinate={SpecificLatLng['Dcruise']}
            tracksViewChanges={false}
            onPress={() => {
              setFirstEventModalVis(true);
            }}
            image={require('../../Assets/Logo/LogoRound192.png')}>
            {/* <View style={{}}>
              <Image
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/hunt-d7d89.appspot.com/o/Assets%2Fplaystore.png?alt=media&token=d3dfecbd-0d40-4f2c-9b6a-4e83070848fa',
                }}
                style={MapScreenStyles.SpeicalHp_Marker}
                resizeMode="cover"
              />
            </View> */}
          </Marker>

          <Circle
            center={SpecificLatLng['Dcruise']}
            strokeWidth={1}
            strokeColor={'black'}
            radius={1500}
            fillColor={'#d3d3d320'}></Circle>
        </MapView>
      )}

      {UserData.Gender == 2 ? GirlTabBar() : ManTabBar()}

      {ManFriendData.NickName != '' ? ProfileImageWithFriend : ProfileImageBox}

      {UserData.Gender == 2 ? BottomBar_Girl() : BottomBar_Man()}
      {/* {Btn_ViewEventAttendedUser()} */}
      {/* <View>
        <TouchableOpacity
          style={[MapScreenStyles.MyLocationBtsn, styles.NoFlexDirectionCenter]}
          onPress={() => {
            moveToMyLocation();
          }}>
          <MaterialIcons name="my-location" size={27} color="#6713D2" />
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity
        style={[MapScreenStyles.MyLocationBtn, styles.NoFlexDirectionCenter]}
        onPress={() => {
          moveToMyLocation();
        }}>
        <MaterialIcons name="my-location" size={27} color="#6713D2" />
      </TouchableOpacity>

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
