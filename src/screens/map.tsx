import React, {useEffect, useState, useRef, useContext, useReducer} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  PermissionsAndroid,
  Image,
  Modal,
  Dimensions,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  AppState,
  FlatList,
  RefreshControl
} from 'react-native';

import { MapScreenStyles } from '../../styles/MapScreen';

import styles from '../../styles/ManToManBoard'
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'

import codePush from 'react-native-code-push';
import { useQuery } from 'react-query';

import {firebase} from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';

import MapView, {LocalTile, Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import firestore from '@react-native-firebase/firestore';
import AntDesgin from "react-native-vector-icons/AntDesign"

import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import {fcmService} from "../UsefulFunctions/push.fcm"
import {localNotificationService} from "../UsefulFunctions/push.noti"
import axios from 'axios';

import MarkerAnimationStyles from "../../styles/MarkerAnimation"
import Ring from './Ring';

import AsyncStorage from '@react-native-community/async-storage';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { Get_itaewon_HotPlaceList } from '../UsefulFunctions/HotPlaceList';
import { SaveUserDataInDevice } from '../UsefulFunctions/SaveUserDataInDevice';

import { AppContext } from '../UsefulFunctions/Appcontext';

import {channelsReducer} from '../reducer/channels';
import Channel from '../component/channel';
import { withAppContext } from '../contextReducer';
import { isEmptyObj } from '../UsefulFunctions/isEmptyObj';

interface ILocation {
  latitude: number;
  longitude: number;
}


const reference = firebase
  .app()
  .database(
    'https://hunt-d7d89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );

const PushAxios = () => {
  axios.post('http://13.124.209.97/firebase/createPushNotificationToMan/uid', {
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

const Get_Query_AllLocation = () => {
  const databaseDirectory = `/Location`;
  return (
    reference
    .ref(databaseDirectory)
    .once('value')
    .then(snapshot => {

      let val = snapshot.val()
      const target = Object.values(val)
      return target
    }).then((AllLocationData)=>{
      // console.log("Get_Query_AllLocation")

      return AllLocationData
    })
  )
 
};

const Get_MansLocations = () => {
  const databaseDirectory = `/ManLocation`;
  return (
    reference
    .ref(databaseDirectory)
    .once('value')
    .then(snapshot => {

      let val = snapshot.val()
      const target = Object.values(val)
      return target
    }).then((AllLocationData)=>{
      console.log("AllLocationData In Get_MansLocations:", AllLocationData)

      return AllLocationData
    })
  )
 
};


const Get_GangNam_HotPlaceList = () => {
  const databaseDirectory = `/HotPlaceList/GangNam`;
  return (
    reference
    .ref(databaseDirectory)
    .once('value')
    .then(snapshot => {

      let val = snapshot.val()
      const target = Object.values(val)
      return target
    }).then((AllLocationData)=>{
      return AllLocationData
    })
  )
 
};

const Get_Sinsa_HotPlaceList = () => {
  const databaseDirectory = `/HotPlaceList/Sinsa`;
  return (
    reference
    .ref(databaseDirectory)
    .once('value')
    .then(snapshot => {

      let val = snapshot.val()
      const target = Object.values(val)
      return target
    }).then((AllLocationData)=>{
      return AllLocationData
    })
  )
 
};
// ManToManBoard에서 글 리스트 가져오는 코드 

const RequestLocationPermissionsAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if(granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("you can use the location")
    } else {
      console.log("Location Permission denied")
    }
  } catch(err) {
    console.log(err)
  }
}

const GetLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('always');
  } else {
    await RequestLocationPermissionsAndroid()
    // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
  }
} 

function Counter(callback:Function, delay:number | null, Reset:Function) {
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
    } else if(delay == null) {
      Reset()
    }
  }, [delay]);
}

const ManLocationUpdate = async (UserEmail:string, ProfileImageUrl:string) => {
  let ReplaceUserEmail = UserEmail.replace('.com','')

  let id = setInterval(()=>{
    const EpochTime = +new Date()
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        console.log("ManLocationForeGroundUpdate")
          reference
          .ref(`/ManLocation/${ReplaceUserEmail}`)
          .update({
            latitude: latitude,
            longitude: longitude,
            ProfileImageUrl: ProfileImageUrl,
            TimeStamp: EpochTime
          })
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 300000, maximumAge: 10000 }
    );

  }, 20000)


  return id
}



const FirebaseInput = async (UserEmail:string, StorageUrl:string) => {

  firestore()
  .collection(`UserList`)
  .doc(UserEmail)
  .update({
    ProfileImageUrl:StorageUrl,
  })
  .then(() => {
    // console.log('User updated!');
  });

}

const ImagePicker = (fun:Function) => {
    const back:string = "back" 
    const duration:number = 10
    const result = launchImageLibrary(
      {
      mediaType:'photo',
      maxWidth:512,
      maxHeight:512,
      videoQuality:'high',
      durationLimit:duration,
      quality:1,
      cameraType:back,
      includeBase64: Platform.OS === 'android',
      includeExtra:false,
      saveToPhots:false,
      selectionLimit:1,
      // presentationStyle:'fullScreen'
    }
    , async (res)=>{
      if (res.didCancel) return;
      // setImageUrl(res?.assets[0]?.Url);
      // console.log("ImagePicker",res.assets[0])
      let LocalImagePath = res.assets[0].uri
      // console.log("LocalImagePath223",LocalImagePath)
      fun(LocalImagePath)

    

    })
}

const PutInStorage = async (LocalImagePath:any, UserEmail:string, Gender:any) => {

  let GenderString:string
  const EpochTime = +new Date()

  if(Gender == 1) {
    GenderString = "Mans"
  } else if (Gender == 2){
    GenderString = "Grils"
  } else {
    GenderString = "except"
  }

  console.log(GenderString)
  const DBUrl = `/ProfileImage/${GenderString}/${UserEmail}`
  // console.log("DBUrl:" , DBUrl)
  const reference = storage().ref(`${DBUrl}/${EpochTime}/ProfileImage`)
  // console.log("LocalImagePath",LocalImagePath)
  await reference.putFile(LocalImagePath)
  const StorageUrl = await reference.getDownloadURL()
  return StorageUrl
}


const ChangeMyProfileImage = async (UserEmail:string, Gender:number, navigation:any) => {

  let fun = async (LocalImagePath:string) => {

    let StorageUrl:string = ""
    await PutInStorage(LocalImagePath,UserEmail,Gender).then((doc)=>{
      StorageUrl = doc
    })
   
    await FirebaseInput(UserEmail, StorageUrl)
    await SaveUserDataInDevice(UserEmail)
    navigation.navigate("IndicatorScreen", {id:20})
  }

  ImagePicker(fun)
}

const GetLocation = (setLocation:Function) => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;
        await setLocation({
          latitude,
          longitude,
        })
        resolve(null)
      },
      (error) => {
          // See error code charts below.
        console.log(error.code, error.message);
        reject()
      },
      { enableHighAccuracy: true, timeout: 300000, maximumAge: 10000 }
);
})
  
}


const DeleteMyLocation = (UserEmail:string, Gender:number) => {

  if(Gender ==2){
    setTimeout(()=>{
      // reference.ref(`/Location/${UserEmail}`).remove()
    }, 180000)
  }
  // } else if(Gender == 1){
  //   console.log("Man")
  // }

}

const UpdateMyLocation = async (UserEmail: string ,Memo:string, PeopleNum:Number,CanPayit:Number,
  ProfileImageUrl:any) => {


  let CanPayNum:string
  if(CanPayit == 1) {
    CanPayNum = "미정"
  } else if(CanPayit == 2){
    CanPayNum = "O"
  } else if(CanPayit == 3){
    CanPayNum = "X"
  }


  if(Memo == "") {
    Memo = "."
  }

  const EpochTime = +new Date()
  let ReplaceUserEmail = UserEmail.replace('.com','')
  // 현재 위치를 db에 업데이트시키는 코드 

  Geolocation.getCurrentPosition(
    (position) => {
      const {latitude, longitude} = position.coords;
        reference
        .ref(`/Location/${ReplaceUserEmail}`)
        .update({
          latitude: latitude,
          longitude: longitude,
          Memo: Memo,
          CanPayit: CanPayNum,
          PeopleNum: PeopleNum,
          ProfileImageUrl: ProfileImageUrl,
          TimeStamp: EpochTime,
          UserEmail: UserEmail

        })
        .then(() => DeleteMyLocation(ReplaceUserEmail, 2));
    },
    (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 300000, maximumAge: 10000 }
  );

}
const logout = (navigation:any, SendBird:any) => {
  RemoveIdentityToken()
  SendBird.disconnect()
  navigation.navigate('ValidInvitationCodeScreen')

}
const RemoveIdentityToken = async () => {
  AsyncStorage.removeItem('UserData');

}
// foreground에서 푸쉬알림 보기 테스트 
function SendPushNotificationInforeground() {
  PushNotificationIOS.addNotificationRequest({
    id:"123",
    title:"hello",
    body:"hi",
    subtitle:"hh",
  });

}

const AndroidPushNoti = () => {
  console.log("AndroidPushNoti")
  
  localNotificationService.showNotification(
    1,
    "title",
    "body",
    {},
    {}
  );
}

// 여자이면 남자위치데이터 불러와서 지도에 보여주는 로직 추가하기 
// 자주 바뀌는 데이터이므로 State화 하기 

const UpdateMyLocationWatch = (setLocation:Function) => {
  const _watchId = Geolocation.watchPosition(
    position => {
      const {latitude, longitude} = position.coords;
      setLocation({latitude, longitude});
      console.log("state location change")
    },
    error => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 3,
      interval: 5000,
      fastestInterval: 2000,
    },
  );

  return () => {
    if (_watchId) {
      Geolocation.clearWatch(_watchId);
    }
  };
}



const MapScreen = (props:any) => {

  const UserData = props.route.params.CurrentUser
  const navigation = useNavigation()

  const Context = useContext(AppContext)
  const SendBird = Context.sendbird



  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  
  const [InvitationCodeToFriend, setInvitationCodeToFriend] = useState([]);
  
  const GetInvitationToFriendCode = async (PkNumber:string) => {
    firestore().collection(`InvitationCodeList`).doc(String(PkNumber))
    .get().then(async (doc)=>{
      const Result = doc.data()
      const InvitationCodeToFriend = Result?.InvitationCodeToFriend

      let Array:Array<Object> = [
      ]
      await firestore().collection('InvitationCodeList')
      .where('InvitationCode', '==', InvitationCodeToFriend[0])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
          let Obj = {
            InvitationCode: InvitationCodeToFriend[0],
            Used: doc.data().Used
          }
          Array.push(Obj)
        })
      })

      await firestore().collection('InvitationCodeList')
      .where('InvitationCode', '==', InvitationCodeToFriend[1])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
          let Obj = {
            InvitationCode: InvitationCodeToFriend[1],
            Used: doc.data().Used
          }

          Array.push(Obj)
        })
      })
      return Array
    }).then((InvitationCodeToFriend)=>{
      console.log(InvitationCodeToFriend)

      setInvitationCodeToFriend(InvitationCodeToFriend)
    })
}


  const [query, setQuery] = useState(null);

  const [state, dispatch] = useReducer(channelsReducer, {
    SendBird,
    UserData,
    channels: [],
    channelMap: {},
    loading: false,
    empty: '',
    error: null,
  });

  const [token, setToken] = useState('');

  const onRegister = (tk: string) => {
    console.log('[App] onRegister : token :', tk);
    if (tk) setToken(tk);
  }
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
  }

  const onOpenNotification = (notify: any) => {
    console.log('[App] onOpenNotification : notify :', notify);
    Alert.alert('누군가가 위치 공유를 시작했습니다!');
    // Alert.alert('Open Notification : notify.body :'+ );

  }

  useEffect(() => {
    console.log("UserData In UseEffect", UserData)
    async function SaveInDevice() { 
      // 로케이션 위치 가져오는 권한설정
      await GetLocationPermission()
      await GetLocation(setLocation)
      // 현재위치를 state화 &추적

      // UpdateMyLocationWatch(setLocation)
      if(UserData.Gender == "1"){
        let Result = ManLocationUpdate(UserData.UserEmail, UserData.ProfileImageUrl)
        return Result
      }
      await GetInvitationToFriendCode(UserData.PkNumber)

    }

    let Result = SaveInDevice(); 

    fcmService.register(onRegister, onNotification,onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    const onChildAdd = database()
      .ref('/Location')
      .on('child_added', snapshot => {
        GrilsLocationsrefetch()
      });

    const ManonChildAdd = database()
    .ref('/ManLocation')
    .on('child_added', snapshot => {
      MansLocationsretech()
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

    SendBird.addConnectionHandler('channels', connectionHandler);
    SendBird.addChannelHandler('channels', channelHandler);


    // const unsubscribe = AppState.addEventListener('change', handleStateChange)

    if (!SendBird.currentUser) {
      // userId를 커낵트시킨 뒤
      SendBird.connect(UserData.UserEmail, (_:any, err:Error) => {
        if (!err) {
          // 에러가 없으면 리프레쉬부분을 실행
          refresh();
        } else {
          // 에러 발생시 리덕스를 통해 로딩 끝남을 알리고, 에러메세지를 보냄
          Alert.alert("Connection failed. Please check the network status.")
        }
      });
    } else {
      // 샌드버드에 등록된 유저값이 존재하면 리프래쉬!
      refresh();
    }

    // Stop listening for updates when no longer required
    return () => {
      database().ref('/Location').off('child_added', onChildAdd);
      database().ref('/ManLocation').off('child_added', ManonChildAdd);
      // clearInterval(Result)
      SendBird.removeConnectionHandler('channels');
      SendBird.removeChannelHandler('channels');
      // unsubscribe.remove();
      // subscription.remove();

    }

  }, []);

  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

   /// on connection event
   const connectionHandler = new SendBird.ConnectionHandler();

   connectionHandler.onReconnectStarted = () => {
     dispatch({
       type: 'error',
       payload: {
         error: 'Connecting..',
       },
     });
   };
   connectionHandler.onReconnectSucceeded = () => {
     dispatch({type: 'error', payload: {error: null}});
     refresh();
 
    //  handleNotificationAction(
    //    navigation,
    //    sendbird,
    //    currentUser,
    //    'channels',
    //  ).catch(err => console.error(err));
   };
   connectionHandler.onReconnectFailed = () => {
     dispatch({
       type: 'error',
       payload: {
         error: 'Connection failed. Please check the network status.',
       },
     });
   };
 
   /// on channel event
   const channelHandler = new SendBird.ChannelHandler();
   channelHandler.onUserJoined = (channel, user) => {
     if (user.userId === SendBird.currentUser.userId) {
       dispatch({type: 'join-channel', payload: {channel}});
     }
   };
   channelHandler.onUserLeft = (channel, user) => {
     if (user.userId === SendBird.currentUser.userId) {
       dispatch({type: 'leave-channel', payload: {channel}});
     }
   };
   channelHandler.onChannelChanged = channel => {
     dispatch({type: 'update-channel', payload: {channel}});
   };
   channelHandler.onChannelDeleted = channel => {
     dispatch({type: 'delete-channel', payload: {channel}});
   };

  const handleStateChange = (newState:any)=> {
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

  const refresh = () => {
    // state값에 sendbird.groupchannel. 그룹채널리스트 만들기 쿼리를 실행한 뒤 리턴값을 state에 저장
    console.log(
      'createMyGroupChannelListQuery:',
      SendBird.GroupChannel.createMyGroupChannelListQuery(),
    );
    setQuery(SendBird.GroupChannel.createMyGroupChannelListQuery());
  };

  const next = () => {
    // query.hasNext가 존재할 때
    console.log('query.hasNext', query.hasNext);
    if (query.hasNext) {
      query.limit = 20;
      query.next((fetchedChannels:any, err:Error) => {
        console.log(
          "In Next Function query.next's callbackFunction's Return Value fectedChannels:,",
          fetchedChannels,
        );
        if (!err) {
          dispatch({
            type: 'fetch-channels',
            payload: {channels: fetchedChannels},
          });
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Failed to get the channels.',
            },
          });
        }
      });
    }
  };


  const [ GpsOn, setGpsOn] = useState(false);

  const [ ModalVisiable, setModalVisiable] = useState(false);
  const [ ProfileModalVisiable, setProfileModalVisiable] = useState(false);
  const [ ShowUserModal, setShowUserModal] = useState(false);
  const [ProfileForGtoM, setProfileForGtoM] = useState({})

  const [ Memo, setMemo] = useState("");
  const [ PeopleNum, setPeopleNum] = useState(1);
  const [ MoenyRadioBox, setMoneyRadioBox] = useState(0)



  const [second, setSecond] = useState<number>(180);
  const {width} = Dimensions.get('window')

  const ChangeModalVisiable = () => {
    setModalVisiable(previousState => !previousState)
  }

  Counter(
    () => {
      if(GpsOn == true) {
        setSecond(second - 1);
      } 
    },
    second >= 1 ? 1000 : null,
    ()=>{
      setSecond(180)
      setGpsOn(false)
    }
  );

  const ShowMyLocation = () => {
    const date = new Date()
    let day = date.getHours()
    day = 23
    console.log(day)
    // day가 오후 10시 ~ 새벽 7시 
    if(day >= 22 && day <=24 || day >= 1 && day <= 7) {
        UpdateMyLocation(UserData.UserEmail,Memo, PeopleNum, MoenyRadioBox, UserData.ProfileImageUrl)
        setGpsOn(true)
        ChangeModalVisiable()
    } else {
      Alert.alert("10시부터 새벽7시까지 이용 가능합니다.")
    }
 
  }

  const SwitchShowUserModal = ()=>{
    setShowUserModal(!ShowUserModal)
  }

  const Stateize = async (ProfileImageUrl:string , UserEmail:string,
    Memo:string, PeopleNum:number, CanPayit:string) => {
   setProfileForGtoM({
     ProfileImageUrl: ProfileImageUrl,
     UserEmail:UserEmail,
     Memo:Memo,
     PeopleNum:PeopleNum,
     CanPayit:CanPayit
   })
 }
  const GirlMarkerOnPress = async (ProfileImageUrl:string , UserEmail:string,
    Memo:string, PeopleNum:number, CanPayit:string) => {

    console.log(Memo, PeopleNum, CanPayit)

    await Stateize(ProfileImageUrl, UserEmail, Memo, PeopleNum, CanPayit)
    SwitchShowUserModal()
  }

  const CreateChating = () => {
    console.log("StartChatingBetweenGirls In TwoMapScreen")
    let params = new SendBird.GroupChannelParams();
    {isEmptyObj(ProfileForGtoM) ? null
    :
    params.addUserIds([`${ProfileForGtoM.UserEmail}`, `${UserData.UserEmail}`]);
    params.coverUrl = ProfileForGtoM.ProfileImageUrl
    params.name = "TestName"
    params.operatorUserIds =  [`${ProfileForGtoM.UserEmail}`],
    params.isDistinct =  true,
    params.isPublic = false;

    SendBird.GroupChannel.createChannel(params, function(groupChannel:any, error:Error) {
      if (error) {
        console.log(error)
          // Handle error.
      } else if (!error){
        SwitchShowUserModal()
        chat(groupChannel)
        console.log("groupChannel In CreateChating Function In MapScreen:",groupChannel)
      }
  
    })
    }
   
  }


  const chat = (channel:any) => {

    setProfileModalVisiable(false)
    navigation.navigate('ChatScreen', {
      channel,
      UserData,
    });

  };

  

  const {data, isLoading, refetch:GrilsLocationsrefetch} = useQuery("QueryLocation", Get_Query_AllLocation)

  const {data:MansLocations, isLoading:isLoadingMansLocations, refetch:MansLocationsretech} = useQuery("MansLocationsUseQuery", Get_MansLocations)

  const {data:itaewon_HotPlaceList, isLoading:itaewon_HotPlaceListisLoading} = useQuery("itaewon_HotPlaceList", Get_itaewon_HotPlaceList)
  const {data:GangNam_HotPlaceList, isLoading:GangNam_HotPlaceListisLoading} = useQuery("GangNam_HotPlaceList", Get_GangNam_HotPlaceList)
  const {data:Sinsa_HotPlaceList, isLoading:Sinsa_HotPlaceListisLoading} = useQuery("Sinsa_HotPlaceList", Get_Sinsa_HotPlaceList)

  const AnimationMarker = (ProfileImageUrl:string) => {
    return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}>

    <View style={[MarkerAnimationStyles.dot, MarkerAnimationStyles.center]}>
      {[...Array(2).keys()].map((_, index) => (
      <Ring key={index} index={index} />
      ))}
      <Image 
        style={MarkerAnimationStyles.Image}
        source={{uri:ProfileImageUrl}}/>
      </View>
    </Marker>
    )
  }

  const MinusIcon = <TouchableOpacity style={[styles.RowCenter,MapScreenStyles.MinusPeopleNumber]}
  onPress={() => {
    if(PeopleNum > 1) {
      setPeopleNum(PeopleNum - 1)
    }
  }}>
  <AntDesgin name='minus' size={16} color="black"/>
  </TouchableOpacity>

  const PlusIcon = <TouchableOpacity style={MapScreenStyles.PlusPeopleNumber} 
  onPress={() => {
    if(PeopleNum < 10) {
      setPeopleNum(PeopleNum + 1)
    }
  }}>
  <AntDesgin name='plus' size={16} color="black"/>
  </TouchableOpacity>

  const ProfileImage = () => {
    return (
      <Image 
      source={{uri:UserData.ProfileImageUrl}}
      style={{width: 100, height: 100, borderRadius:10}}
      />
    )
  }

  const ShowUserModalGen = () => {
    return ( 
      <Modal 
      animationType="slide"
      transparent={true}
      visible={ShowUserModal}
    >
      <SafeAreaView
        style={MapScreenStyles.Memomodal}
      >
        <Text style={{color:'white', fontSize:22, fontWeight:'500', marginLeft:'5%', marginBottom:20, marginTop:20}}>나의 상태 설정하기</Text>
        <View style={[styles.W90ML5]}>
          <Image 
            source={{uri:ProfileForGtoM?.ProfileImageUrl}}
            style={{width: 43, height: 43}}
          />
          {ProfileForGtoM.Memo != undefined ?
          <>
             <Text style={MapScreenStyles.WhiteText}>메모:{ProfileForGtoM?.Memo}</Text>
             <Text style={MapScreenStyles.WhiteText}>인원수:{ProfileForGtoM?.PeopleNum}명</Text>
             <Text style={MapScreenStyles.WhiteText}>지불여수:{ProfileForGtoM?.CanPayit}</Text>
          </>
          :null}
       
        </View>
  
          <View style={[styles.Row_OnlyColumnCenter]}>
  
            <TouchableOpacity 
            style={[styles.RowCenter,MapScreenStyles.CancelBoxView]}
            
            onPress={()=>{
              SwitchShowUserModal()
            }}
            > 
              <Text>취소</Text>
          
            </TouchableOpacity>
            
            <TouchableOpacity 
            style={[styles.RowCenter,MapScreenStyles.CheckBoxView, {backgroundColor:'#28FF98'}]}
            onPress={()=>{
              CreateChating()
            }}
            > 
              <Text>채팅하기</Text>
          
            </TouchableOpacity>
            
          
          </View>
  
        
      </SafeAreaView>
  
      </Modal>
      )
  }

  
  return (
    <View style={{width:'100%', height:'100%'}}>
      <Modal
        animationType='slide'
        visible={ProfileModalVisiable}
        transparent={true}
        >
          <SafeAreaView style={MapScreenStyles.ProfileModalParent}>

            <View style={MapScreenStyles.ProfileModalScrollView}>
              <TouchableOpacity
                style={{
                  width:100,
                  height:100,
                  backgroundColor:'white'
                }}
              onPress={()=>{
                ChangeMyProfileImage(UserData.UserEmail, UserData.Gender, navigation)
              }}>
               {ProfileImage()}

              </TouchableOpacity>
              <Text style={{color:'white', fontSize:22, fontWeight:'600'}}>내 등급</Text>
              <Text style={{color:'white', marginLeft:'50%'}}>50%</Text>
              <Progress.Bar progress={0.5} width={width*0.9}
                // indeterminate={true}
                color={'skyblue'}
                // unfilledColor={'black'}
                borderWidth={1}
                // borderColor="red"
                height={8}
                borderRadius={15}
              />
              <Button title="X"
                onPress={()=>{
                  setProfileModalVisiable(false)
                }}
              />
            <FlatList
                data={state.channels}
                renderItem={({item}) => (
                  <Channel
                    key={item.url}
                    channel={item}
                    sendbird={SendBird}
                    onPress={channel => chat(channel)}
                  />
                )}
                keyExtractor={item => item.url}
                refreshControl={
                  <RefreshControl
                    refreshing={state.loading}
                    colors={['#742ddd']}
                    tintColor={'#742ddd'}
                    onRefresh={refresh}
                  />
                }
                contentContainerStyle={{flexGrow: 1}}
                // ListHeaderComponent={
                //   state.error && (
                //     <View style={style.errorContainer}>
                //       <Text style={style.error}>{state.error}</Text>
                //     </View>
                //   )
                // }
                // ListEmptyComponent={
                //   <View style={style.emptyContainer}>
                //     <Text style={style.empty}>{state.empty}</Text>
                //   </View>
                // }
                onEndReached={() => next()}
                onEndReachedThreshold={0.5}
              />


          
              <Text style={[styles.WhiteColor]}>내 latitude:{location?.latitude}</Text>
              <Text style={[styles.WhiteColor]}>내 longitude:{location?.longitude}</Text>

              {InvitationCodeToFriend.length != 0 ? 
              <>
              <Text style={styles.WhiteColor}>초대코드1: {InvitationCodeToFriend[0].InvitationCode} {InvitationCodeToFriend[0].Used ? "사용됨": "초대하기"}</Text>
              <Text style={styles.WhiteColor}>초대코드2: {InvitationCodeToFriend[1].InvitationCode} {InvitationCodeToFriend[1].Used ? "사용됨": "초대하기"}</Text>
              </>
              : null}

              <Button title="로그아웃 하기" color={'red'}
                onPress={()=>{
                  logout(navigation, SendBird)
                }}
              ></Button>

              
             
              

            </View>


         
      

          </SafeAreaView>

      </Modal>
      <Modal 
        animationType="slide"
        transparent={true}
        visible={ModalVisiable}
      >
        <SafeAreaView
          style={MapScreenStyles.Memomodal}
        >
          <Text style={{color:'white', fontSize:22, fontWeight:'500', marginLeft:'5%', marginBottom:20, marginTop:20}}>나의 상태 설정하기</Text>
          <View style={[{height:96, }, styles.W90ML5]}>
            <Text style={[MapScreenStyles.WhiteText, {fontSize:14, fontWeight:'500', marginBottom:8}]}>메모로 상태알리기</Text>
            <Text style={[{fontSize:12, fontWeight:'400', color:'#6A6A6A', marginBottom:8}]}>고객님의 상태, 위치, 정보를 50자 이내로 입력해주세요.</Text>
            <TextInput
              value={Memo}
              onChangeText={(text) => setMemo(text)}
              style={MapScreenStyles.MemoTextInput}>
            </TextInput>    
          </View>

          <View style={[styles.W90ML5,{height:96, marginTop:20, marginBottom:20}]}>
            <Text style={[MapScreenStyles.WhiteText, styles.FW500FS14,{marginBottom:8}]}>인원알려주기</Text>
            <Text style={[{fontSize:12, fontWeight:'400', color:'#6A6A6A', marginBottom:8}]}>몇명이서 오셨나요?</Text>
            <View style={[MapScreenStyles.PeopleNumOption, styles.Row_OnlyColumnCenter, ]}>
                <Text style={[styles.WhiteColor, styles.FW500FS14, {marginLeft:'5%'}]}>인원</Text>
                <View style={[styles.Row_OnlyColumnCenter, {width:'30%', justifyContent:'space-between', marginRight:'5%'}]}>
                {MinusIcon}
                  <Text style={[styles.WhiteColor,MapScreenStyles.TotalPeopleNum]}>{PeopleNum}명</Text>
                {PlusIcon}
              </View>
            </View>    
          </View>

          <View style={[{height:110, marginBottom:10}, styles.W90ML5]}>
            <Text style={[MapScreenStyles.WhiteText, {fontSize:14, fontWeight:'500', marginBottom:8}]}>비용 나눠 내기</Text>
            <Text style={[{fontSize:12, fontWeight:'400', color:'#6A6A6A', marginBottom:8}]}>만남 후 비용을 나눠서 지불할 생각이 있으신가요?</Text>
            <View style={[styles.Row_OnlyColumnCenter, MapScreenStyles.MoneyOptionView, {marginTop:10}]}>
   
            <TouchableOpacity 
              onPress={()=>{setMoneyRadioBox(1)}}
              style={MoenyRadioBox == 1 ? MapScreenStyles.SelectedMoneyIconBox:MapScreenStyles.MoneyIconBox}
              >
                <Text style={MoenyRadioBox == 1 ?{color:'#606060',fontWeight:'600'} :{color:'#202124',fontWeight:'600'}}>보고결정</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={()=>{setMoneyRadioBox(2)}}
              style={MoenyRadioBox == 2 ? MapScreenStyles.SelectedMoneyIconBox:MapScreenStyles.MoneyIconBox}
              >
   
                <Text style={MoenyRadioBox == 2 ?{color:'#606060',fontWeight:'600'} :{color:'#202124',fontWeight:'600' }}>생각있음</Text>
              </TouchableOpacity>

              <TouchableOpacity 
              onPress={()=>{setMoneyRadioBox(3)}}
              style={MoenyRadioBox == 3 ? MapScreenStyles.SelectedMoneyIconBox:MapScreenStyles.MoneyIconBox}
              >
                <Text style={MoenyRadioBox == 3?{color:'#606060',fontWeight:'600'} :{color:'#202124',fontWeight:'600'}}>생각있음</Text>
              </TouchableOpacity>
            </View>
          </View> 
            


            <View style={[styles.Row_OnlyColumnCenter]}>

              <TouchableOpacity 
              style={[styles.RowCenter,MapScreenStyles.CancelBoxView]}
              
              onPress={()=>{
                ChangeModalVisiable()
              }}
              > 
                <Text>취소</Text>
            
              </TouchableOpacity>


              {Memo != '' && MoenyRadioBox != 0
              ?
              <TouchableOpacity 
              style={[styles.RowCenter,MapScreenStyles.CheckBoxView, {backgroundColor:'#28FF98'}]}
              onPress={()=>{
                ShowMyLocation()
              }}
              > 
                <Text>완료</Text>
            
              </TouchableOpacity>
              :
              <View 
              style={[styles.RowCenter,MapScreenStyles.CheckBoxView , {backgroundColor:'#565656'}]}
              > 
                <Text>완료</Text>
            
              </View>
              }
              
            
            </View>

          
        </SafeAreaView>

      </Modal>

      {ShowUserModalGen()}
      {location && (
        <MapView
          style={{width:'100%', height:'100%'}}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={!GpsOn}
          loadingEnabled={true}
          userInterfaceStyle="light"
          minZoomLevel={10}
          maxZoomLevel={17}
          >
          {GpsOn == true ?
          <Marker
          coordinate={{
            // latitude: 37.5817005,
            // longitude: 126.9355308
            latitude: location.latitude,
            longitude: location.longitude
          }}>
          <View 
          style={[MarkerAnimationStyles.dot, MarkerAnimationStyles.center, {
          }]}
          >
          {[...Array(3).keys()].map((_, index) => (
            <Ring key={index} index={index} />
            ))}
          
          <Image 
            style={MarkerAnimationStyles.Image}
            source={{uri:UserData.ProfileImageUrl}}/>
          </View>
          </Marker>
          :null}


          
          {/* {isLoading == false ?
          data?.map((data,index)=>{
            return(
            <Marker
              key={data.latitude}
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude
              }}
              title={data?.Memo}
              tracksViewChanges={false}
              description={'인원: ' + data.PeopleNum + ' 지불여부: ' + data.CanPayit + " 메모: " + data.Memo}
              onPress={()=>{
                GirlMarkerOnPress(data.ProfileImageUrl, data.UserEmail,
                  data.Memo , data.PeopleNum, data.CanPayit)
              }}
            >
              <View>
                <Image 
                  source={{uri:data.ProfileImageUrl}}
                  style={MapScreenStyles.GrilsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>
            )
            
          })
          : null} */}
          {isLoading == false ?
          data?.map((data,index)=>{
            return(
            <Marker
              key={data.latitude}
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude
              }}
              title={data?.Memo}
              tracksViewChanges={false}
              description={'인원: ' + data.PeopleNum + ' 지불여부: ' + data.CanPayit + " 메모: " + data.Memo}
              onPress={()=>{
                GirlMarkerOnPress(data.ProfileImageUrl, data.UserEmail,
                  data.Memo , data.PeopleNum, data.CanPayit)
              }}
            >
            <View style={styles.NoFlexDirectionCenter}>

              {[...Array(3).keys()].map((_, index) => (
              <Ring key={index} index={index} />
              ))}

              <Image 
              style={MapScreenStyles.GrilsMarker}
              source={{uri:data.ProfileImageUrl}}
              resizeMode="cover"
              />

              </View>
            </Marker>
            )
            
          })
          : null}

          {isLoadingMansLocations == false && UserData.Gender == 2 ?
           MansLocations.map((MansData,index)=>{
            return(
            <Marker
              key={MansData.latitude}
              coordinate={{
                latitude: MansData.latitude,
                longitude: MansData.longitude
              }}
              tracksViewChanges={false}
              onPress={()=>{
                GirlMarkerOnPress(MansData.ProfileImageUrl, MansData.UserEmail)
              }}
            >
              <View>
                <Image 
                  source={{uri:MansData.ProfileImageUrl}}
                  style={MapScreenStyles.GrilsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>
            )
          })
          :null}



          {itaewon_HotPlaceListisLoading == false ? 
          itaewon_HotPlaceList?.map((data,index)=>{
            return(
              <Marker
                key={data.Title}
                coordinate={{
                  latitude:data.latitude,
                  longitude: data.longitude
                }}
                title={data.Title}
                tracksViewChanges={false}

              >
                <View>
                  <Image 
                    source={{uri:data.Image}}
                    style={MapScreenStyles.HP_Marker}
                    resizeMode="cover"
                  />
                </View>
              </Marker>
              )
          }) :null}
          
          {GangNam_HotPlaceListisLoading == false ? 
          GangNam_HotPlaceList?.map((data,index)=>{
            return(
              <Marker
                key={data.Title}
                coordinate={{
                  latitude:data.latitude,
                  longitude: data.longitude
                }}
                title={data.Title}
                tracksViewChanges={false}

              >
                <View>
                  <Image 
                    source={{uri:data.Image}}
                    style={MapScreenStyles.HP_Marker}
                    resizeMode="cover"
                  />
                </View>
              </Marker>
              )
          }) :null}

          {Sinsa_HotPlaceListisLoading == false ? 
          Sinsa_HotPlaceList?.map((data,index)=>{
            return(
              <Marker
                key={data.Title}
                coordinate={{
                  latitude:data.latitude,
                  longitude: data.longitude
                }}
                title={data.Title}
                tracksViewChanges={false}

              >
                <View>
                  <Image 
                    source={{uri:data.Image}}
                    style={MapScreenStyles.HP_Marker}
                    resizeMode="cover"
                  />
                </View>
              </Marker>
              )
          }) :null}
          

          
          
        </MapView>
      )}

      {UserData.Gender == 2 ? 
      <SafeAreaView style={[styles.Row_OnlyColumnCenter,MapScreenStyles.TopView]}>
          <Text style={{color:'white', fontWeight:'500', fontSize:14}}>나의위치 표시하기</Text>

          {GpsOn == false ? 
          <Text style={{color:'#9F9F9F', fontSize:16, fontWeight:'500'}}>
          {Math.floor(second / 60)} : {second % 60}
          </Text>
          :  <Text style={{color:'#28FF98', fontSize:16, fontWeight:'500'}}>
          {Math.floor(second / 60)} : {second % 60}
          </Text>}
          {GpsOn == false ? 
          
          <View style={[styles.NoFlexDirectionCenter,{width:38, height:22, 
            backgroundColor:'#B4B4B4', borderRadius:4}]}>
            <Text style={{fontWeight:'500', fontSize:14}}>ON</Text>
          </View>
          :<View style={[styles.NoFlexDirectionCenter,{width:33, height:22, 
            backgroundColor:'#28FF98', borderRadius:4}]}>
            <Text style={{fontWeight:'500', fontSize:14}}>ON</Text>
          </View>}

          

      </SafeAreaView>
      :null}

      <View style={[
        styles.NoFlexDirectionCenter,
        MapScreenStyles.ChangeProfileView]}>
        <TouchableOpacity 
        style={[{
          backgroundColor:'#202632',
          borderRadius:25,
        },styles.NoFlexDirectionCenter]}
        onPress={()=>{
          // RemoveIdentityToken()
          setProfileModalVisiable(!ProfileModalVisiable)
        }}>
          <Image 
          source={{uri:UserData.ProfileImageUrl}}
          style={{width: 43, height: 43, borderRadius:35}}
          />
        </TouchableOpacity>
      </View> 
      

      {UserData.Gender == 2 ? 
       <TouchableOpacity style={[MapScreenStyles.StartView, styles.NoFlexDirectionCenter,]}
        onPress={()=> {
          // AndroidPushNoti()
          ChangeModalVisiable()
        }}
       >
        <Text style={{color:'white'}}>시작하기</Text>
        
      </TouchableOpacity>
      : null}

      {/* {location && (
        <TouchableOpacity style={[MapScreenStyles.StartView, styles.NoFlexDirectionCenter,]}>
          <Text style={{color:'white'}}>{location.latitude}</Text>
          <Text style={{color:'white'}}>{location.longitude}</Text>
        </TouchableOpacity>
      )} */}


    </View>
  );
};  

// 자신의 위치를 트랙킹해서 맵에 보여주는 컴포넌트
const TrackUserLocation = () => {
  const [locations, setLocations] = useState<Array<ILocation>>([]);
  let _watchId: number;

  //_watchId라는 값에 Geolocation.watchPostion의 반환값을 저장. 
  // locations state가 변경될때마다 rendering -> 즉 위치변경때마다 화면렌더링을 
  // 통해 마커로 지도 내 자신의 위치를 추적


  useEffect(() => {
    _watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocations([...locations, {latitude, longitude}]);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 100,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  }, [locations]);

  // _watchId가 null이 아니면 clear..?? 
  // Watch에 대해 더 공부할 필요가 있다. 

  useEffect(() => {

    GetLocationPermission()
    return () => {
      if (_watchId !== null) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, []);

  return (
    <View style={{
      flex:1
    }}>
      {locations.length > 0 && (
        <MapView
          // {Platform.OS === 'android' ? provider={PROVIDER_GOOGLE} : provider={default}}
          showsUserLocation
          // followsUserLocation
          loadingEnabled
          style={{flex: 1}}
          initialRegion={{
            // latitude: locations[0].latitude,
            // longitude: locations[0].longitude,
            latitude: 37.5226,
            longitude: 127.0280,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {locations.map((location: ILocation, index: number) => (
            <Marker
            key={`location-${index}`}
            coordinate={{ 
              latitude: location.latitude,
              longitude: location.longitude
            }}
            >
              <View
              style={{
                height:35,
                width:35,
                borderRadius:50,
                backgroundColor:'white',
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
              }}
              >
                <Image 
                  source={{uri:'https://thumb.mt.co.kr/06/2021/04/2021042213221223956_1.jpg/dims/optimize/'}}
                  style={{width: 30, height: 30
                  ,borderRadius:35}}
                  resizeMode="cover"
                />
              </View>
          </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};


export default withAppContext(codePush(MapScreen));



