import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
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
  ScrollView
} from 'react-native';1

import styles from '../../styles/ManToManBoard'
import Icon from "react-native-vector-icons/Ionicons"
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'

import codePush from 'react-native-code-push';
import { useQuery } from 'react-query';

import {firebase} from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';

import MapView, {LocalTile, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AppContext from '../UsefulFunctions/Appcontext'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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

async function requestPushNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }
}

async function GetFCMToken() {
  const token = await messaging().getAPNSToken()

  // console.log("APNSToken:",token)
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

const Get_GrilsLocations = (setGrilsLocations:Function) => {
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
      setGrilsLocations(AllLocationData)
    })
  )
 
};

const Get_itaewon_HotPlaceList = () => {
  const databaseDirectory = `/HotPlaceList/itaewon`;
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


const Get_itaewon_HotPlaceList_useEffect = async (setitaewon_HotPlaceList:Function) => {
  const databaseDirectory = `/HotPlaceList/itaewon`;
  return (
    await reference
    .ref(databaseDirectory)
    .once('value')
    .then(snapshot => {

      let val = snapshot.val()
      const target = Object.values(val)
      return target
    }).then((AllHPLocations)=>{
      setitaewon_HotPlaceList(AllHPLocations)
    })
  )
 
};

const Get_ProfileImageUrl = (userEmail:string) => {
  let ProfileImageUrl = ""
  let uM = userEmail.queryKey[1]
  return (
    firestore()
    .collection(`UserList`)
    .doc(uM)
    .get()
    .then(doc => {
      // console.log("Get_ProfileImageUrl",doc.data()?.ProfileImageUrl)
      let PfIU = doc.data()?.ProfileImageUrl
      return PfIU
    }).then((ProfileImageUrl)=>{
      return ProfileImageUrl
    })
  )
}

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


const ManLocationUpdate = async () => {
  const userEmail = await AsyncStorage.getItem('IdentityToken');
  const ProfileImageUrl = await AsyncStorage.getItem('ProfileImageUrl');

  let ReplaceUserEmail = userEmail.replace('.com','')

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



const FirebaseInput = (userEmail:string, StorageUrl:string) => {

  firestore()
  .collection(`UserList`)
  .doc(userEmail)
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

const PutInStorage = async (LocalImagePath:any, userEmail:string, Gender:any) => {
  const DBUrl = `/ProfileImage/${Gender}/${userEmail}`
  // console.log("DBUrl:" , DBUrl)
  const reference = storage().ref(`${DBUrl}/ProfileImage`)
  // console.log("LocalImagePath",LocalImagePath)
  await reference.putFile(LocalImagePath)
  const StorageUrl = await reference.getDownloadURL()
  return StorageUrl
}

const GetGender = async (userEmail:string) => {
  const Result = await firestore()
  .collection(`UserList`)
  .doc(`${userEmail}`)
  .get()

  Result:Array
  const Gender = Result.data().Gender
  
  if(Gender == 1){
    return "Man"
  } else if(Gender ==2){
    return "Grils"
  }
 
}

const GetUserData = () => {
  const Result = firestore()
  .collection(`UserList`)
  .doc(`8269apk@naver.com`)
  .get()

  console.log("GetUserData:" , Result)
}

const saveProfileImageUrlInDevice = (StorageUrl:string)=>{
  AsyncStorage.setItem("ProfileImageUrl", StorageUrl);

}

const ChangeMyProfileImage = async (userEmail:string) => {

  let fun = async (LocalImagePath:string) => {

    const Gender = await GetGender(userEmail)

    let StorageUrl:string = ""
    await PutInStorage(LocalImagePath,userEmail,Gender).then((doc)=>{
      StorageUrl = doc
    })
   
    saveProfileImageUrlInDevice(StorageUrl)
    
    FirebaseInput(userEmail, StorageUrl)
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


const DeleteMyLocation = (userEmail:string, Gender:number) => {

  if(Gender ==2){
    setTimeout(()=>{
      reference.ref(`/Location/${userEmail}`).remove()
    }, 180000)
  }
  // } else if(Gender == 1){
  //   console.log("Man")
  // }

}

const getProfileImageUrl = async (userEmail:string) => {

  let ProfileImageUrl = ""

  await firestore()
  .collection(`UserList`)
  .doc(userEmail)
  .get()
  .then((doc) => {
    ProfileImageUrl = doc.data().ProfileImageUrl
  });

  return ProfileImageUrl
}

const UpdateMyLocation = async (userEmail: string ,Memo:string, PeopleNum:Number,CanPayit:Number,
  location:any) => {

  const ProfileImageUrl = await getProfileImageUrl(userEmail)

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
  let ReplaceUserEmail = userEmail.replace('.com','')
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
          TimeStamp: EpochTime

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


const CheckIdentityToken = async () => {
let id = await AsyncStorage.getItem('IdentityToken');
  let id2 = await AsyncStorage.getItem("ProfileImageUrl");

  console.log(id, id2)

}

const logout = (navigation:any) => {
  RemoveIdentityToken()
  
  navigation.navigate('ValidInvitationCodeScreen')

}
const RemoveIdentityToken = async () => {
  AsyncStorage.removeItem('IdentityToken');
  

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

const SaveEmailInDevice = async (myContext: any) => {
  const userEmail = await AsyncStorage.getItem('IdentityToken');
  // console.log("asyncemail -> mycontext")
  myContext.setUserEmail(userEmail)
}

const SaveProfileImageUrlInDevice = async (myContext:any) => {
  const ProfileImageUrl = await AsyncStorage.getItem('ProfileImageUrl');
  // console.log("SaveProfileImageUrlInDevice",ProfileImageUrl)
  // console.log("asyncprofileImageUrl -> mycontext")

  myContext.setProfileImageUrl(ProfileImageUrl)

}

const SaveGenderInDevice = async (myContext:any) => {
  const userEmail = await AsyncStorage.getItem('IdentityToken');
  const Gender = await GetGender(userEmail)
  myContext.setUserGender(Gender)
}

const SaveGenderInDevicePromise = async () => {
  return (
    new Promise(async (resolve, reject) => {
      const userEmail = await AsyncStorage.getItem('IdentityToken');
      const Gender = await GetGender(userEmail)
      resolve(Gender)
    })

  )

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

const MapScreen = () => {

  console.log("Render")

  const navigation = useNavigation()

  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const myContext = useContext(AppContext);

  const [updatenum, updateState] = useState();
  const forceUpdate = useCallback(()=> updateState({}), [])

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
    async function SaveInDevice() { 
      // 로케이션 위치 가져오는 권한설정
      await GetLocationPermission()
      // 푸쉬알림 권한설정 
      await requestPushNotificationPermission()
      await GetLocation(setLocation)
      // 현재위치를 state화 &추적

      // UpdateMyLocationWatch(setLocation)
    
      console.log("0")

      await SaveEmailInDevice(myContext)
      console.log("1")

      await SaveProfileImageUrlInDevice(myContext)
      console.log("2")

      await SaveGenderInDevice(myContext)

      SaveGenderInDevicePromise().then((data)=>{
        console.log("Gender Data InSaveGenderInDevicePromise:", data)
        if(data == "Man"){
          ManLocationUpdate()
        }
      })

      


    }

    SaveInDevice(); 

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


    
    // Stop listening for updates when no longer required
    return () => {
      database().ref('/Location').off('child_added', onChildAdd);
      database().ref('/ManLocation').off('child_added', ManonChildAdd);
    }

  }, []);

  const [ GpsOn, setGpsOn] = useState(false);

  const [ ModalVisiable, setModalVisiable] = useState(false);
  const [ ProfileModalVisiable, setProfileModalVisiable] = useState(false);

  const [ Memo, setMemo] = useState("");
  const [ PeopleNum, setPeopleNum] = useState(1);
  const [ MoenyRadioBox, setMoneyRadioBox] = useState(0)



  const [second, setSecond] = useState<number>(180);
  const {width} = Dimensions.get('window')

  const ChangeModalVisiable = () => {
    setModalVisiable(previousState => !previousState)
  }

  // const ChangePeopleNum = (Fun:Function) => {
  //   if(PeopleNum > 0){
  //     Fun()
  //   } else {

  //   }

  // }

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
        UpdateMyLocation(myContext.userEmail,Memo, PeopleNum, MoenyRadioBox, location)
        setGpsOn(true)
        ChangeModalVisiable()
    } else {
      Alert.alert("10시부터 새벽7시까지 이용 가능합니다.")
    }
 
  }
  const {data, isLoading, refetch:GrilsLocationsrefetch} = useQuery("QueryLocation", Get_Query_AllLocation)

  const {data:MansLocations, isLoading:isLoadingMansLocations, refetch:MansLocationsretech} = useQuery("MansLocationsUseQuery", Get_MansLocations)
  

  // useEffect(()=>{
  //   refetch()
  // }, [updatenum])

  const {data:itaewon_HotPlaceList, isLoading:itaewon_HotPlaceListisLoading} = useQuery("itaewon_HotPlaceList", Get_itaewon_HotPlaceList)
  const {data:ProfileImageUrl, isLoading:ProfileImageUrlisLoading} = useQuery(["ProfileImageUrl", myContext.userEmail], Get_ProfileImageUrl)
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
      source={{uri:myContext.ProfileImageUrl}}
      style={{width: 100, height: 100, borderRadius:10}}
      />
    )
  }

  const PersonIcon = () => {
    return (
      <Icon name='person' size={26} color='red'/>
    )
  }

  const TextHello = () => {
    return (
      <Text style={{color:'white'}}>Hello</Text>
    )
  }
  const FiveTextHello = () => {
    return (
      <>
      {TextHello()}
      {TextHello()}
      {TextHello()}
      {TextHello()}
      {TextHello()}
    </>
    )
  }

  const FFiveTextHello = () => {
    return (
      <>
      {FiveTextHello()}
      {FiveTextHello()}
      {FiveTextHello()}
      {FiveTextHello()}
      {FiveTextHello()}
    </>
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
            <ScrollView style={MapScreenStyles.ProfileModalScrollView}>
              <TouchableOpacity
                style={{
                  width:100,
                  height:100,
                  backgroundColor:'white'
                }}
              onPress={()=>{
                ChangeMyProfileImage(myContext.userEmail)
              }}>
              {ProfileImageUrlisLoading == false ?
                ProfileImage() 
                :
                PersonIcon()
              }

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
              ></Button>

              {FFiveTextHello()}

              <Text style={[styles.WhiteColor]}>{location?.latitude}</Text>
              <Text style={[styles.WhiteColor]}>{location?.longitude}</Text>

              <Button title="로그아웃 하기" color={'red'}
                onPress={()=>{
                  logout(navigation)
                }}
              ></Button>
             
              

            </ScrollView>
         
      

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
          {GpsOn == true  && ProfileImageUrlisLoading == false? 
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
            source={{uri:ProfileImageUrl}}/>
          </View>
          </Marker>
          :null}
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
          : null}

          {isLoadingMansLocations == false ?
           MansLocations.map((MansData,index)=>{
            return(
            <Marker
              key={MansData.latitude}
              coordinate={{
                latitude: MansData.latitude,
                longitude: MansData.longitude
              }}
              tracksViewChanges={false}
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
          
          

          
          
        </MapView>
      )}



     
  
      {myContext.userGender == "Grils" ? 
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
          // forceUpdate()
          setProfileModalVisiable(!ProfileModalVisiable)
        }}>
          {ProfileImageUrlisLoading == false ?  
            <Image 
            source={{uri:myContext.ProfileImageUrl}}
            style={{width: 43, height: 43, borderRadius:35}}
            />:
          <Icon name='person' size={26} color='white'/>
          }

        </TouchableOpacity>
      </View> 
        

      {myContext.userGender == "Grils" ? 
       <TouchableOpacity style={[MapScreenStyles.StartView, styles.NoFlexDirectionCenter,]}
        onPress={()=> {
          // AndroidPushNoti()
          // ChangeModalVisiable()

          GrilsLocationsrefetch()
          // forceUpdate()

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

let {height} = Dimensions.get('window')
height = Math.ceil(height)
console.log(height)

let NS = height * 0.57
let NS2 = height * 0.7
const MapScreenStyles = StyleSheet.create({
  ProfileModalParent: {
    height:'95%', width:'100%', 
    backgroundColor:'black',
    top:'5%',
    borderTopLeftRadius:15,
    borderTopRightRadius:15
  },
  ProfileModalScrollView:{
    width:'90%',
    marginLeft:'5%'
  },
  TopView: {position:'absolute', left:'5%', top:'6%', width:'68%', height:46,
  backgroundColor:'#606060', borderRadius:6, justifyContent:'space-around'},
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  Memomodal: {
    // height:NS,
    // height:533,
    height:NS2,
    top:'14%',
    width:'90%',
    position:'absolute',
    backgroundColor:'black',
    // top:'21.5%',
    left:'5%',
    borderRadius:14,
    display:'flex',
    flexDirection:'column',
    // justifyContent:'space-around'
  },
  MinusPeopleNumber : {
    width:18,
    height:18,
    backgroundColor:'#565656',
  },

  PlusPeopleNumber : {
    width:18,
    height:18,
    backgroundColor:'white',
  },
  
  TotalPeopleNum : {
    fontSize:14,
    fontWeight:'bold'
  },

  MoneyIconBox: [{
    width:63,
    height:30,
    borderRadius:4,
    backgroundColor:'#3E3E3E',
  }, styles.NoFlexDirectionCenter],

  SelectedMoneyIconBox: [{
    backgroundColor:'#28FF98',
    width:63,
    height:30,
    borderRadius:4,

  }, styles.NoFlexDirectionCenter],

  MemoTextInput: {
    width: '100%',
    height: 46,
    backgroundColor: '#3E3E3E',
    borderRadius: 6,
    padding: 15,
  },

  MoneyOption :{
    height: 50,
    width:'15%',
    borderWidth:2,
    borderStyle:'solid',
    borderColor:'lightgray',
    borderRadius:10,
    backgroundColor:'red',
    marginLeft:'5%',
  },

  PeopleNumOption: {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    height: 46,
    backgroundColor: '#3E3E3E',
    borderRadius: 6,
  },

  MoneyOptionView: {
    // height:'25%',
    width:'100%',
    justifyContent:'space-between'
  },
  
  CheckBoxView :{
    height: 46,
    width:'42.5%',
    borderRadius:6,
    marginLeft:'5%'
    
  },

  CancelBoxView :{
    height: 46,
    width:'42.5%',
    borderRadius:6,
    backgroundColor:'#F5F5F5',
    marginLeft:'5%'
  },
  ChangeProfileView : {
    // width:'10%',
    // height:'5%',
    width:46,
    height:46,
    borderRadius:50,
    position:'absolute',
    // left:'88%',
    right:'7%',
    top:'6%',
    // 11/08) 여기는 젤리처럼 그레디언트 컬러 필요함.
    // backgroundColor:'#0064FF',
    // backgroundColor:'#202632',
    // backgroundColor:'#4EB789',
    // phonering 보라
    // backgroundColor:'#6E01EF',
    borderWidth:3,
    borderColor:'#202124',
    borderStyle:'solid'
    
  },

  StartView :{
    width:'90%',
    height:50,
    // backgroundColor:'#202632',
    backgroundColor:'#202124',
    position:'absolute',
    left:'5%',
    bottom:'6%',
    borderRadius:10
  },

  GrilsMarker: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  HP_Marker: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'black',
  },

  WhiteText: {
    color:'white',
  }

});

export default codePush(MapScreen);



