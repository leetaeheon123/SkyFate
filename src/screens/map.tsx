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
  TouchableOpacity
} from 'react-native';

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
      // console.log("Get_Query_AllLocation_val",val)
      // if(val == false) {
        // val = [{}]
      // }
      const target = Object.values(val)
      return target
    }).then((AllLocationData)=>{
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

const GetLocationPermission = () => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization('always');
  } else {
    RequestLocationPermissionsAndroid()
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
  Geolocation.getCurrentPosition(
    (position) => {
      const {latitude, longitude} = position.coords;
      setLocation({
        latitude,
        longitude,
      })
    },
    (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 300000, maximumAge: 10000 }
);
}

const DeleteMyLocation = (userEmail:string) => {
  setTimeout(()=>{
    reference.ref(`/Location/${userEmail}`).remove()

    // 1. 사용자가 10초 간격으로  switch를 on - off - 10초 후 - on - off 10초 후 - on을 눌렀다고 가정해보자
    // 처음 on은 누른 후 20초후에 자신의 위치가 실시간으로 db에 저장되고. 원래라면 1분 후에 자신의 위치가 지워져야 정상이다.
    // 하지만 처음 off를 눌렀을 때 걸린 settimeout때문에 40초 뒤에 자신의 위치가 삭제된다. 어떻게 해결할까? 

    // 1. ui에 1분 타이머를 걸어놔서 사용자가 on off를 계속 누르지 않도록 유도한다
    // 2. 기술적으로 40초가 아닌 1분후에 삭제되도록 만든다 -> 지금 드는 생각으론 cleartimeout?을 사용해보는게 어떨가 

    // 이부분 로직은 파이어베이스 단에서 처리하도록 

    // console.log('Hello')

  }, 180000)
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
  // console.log("UpdateMyLocation",ProfileImageUrl)

  let CanPayNum;
  if(CanPayit == 1) {
    CanPayNum = "O"
  } else if(CanPayit == 2){
    CanPayNum = "X"
  } else {
    CanPayNum = "미정"
  }


  if(Memo == "") {
    Memo = "."
  }

  

  const EpochTime = +new Date()
  let ReplaceUserEmail = userEmail.replace('.com','')

  reference
  .ref(`/Location/${ReplaceUserEmail}`)
  .update({
    latitude: location.latitude,
    longitude: location.longitude,
    Memo: Memo,
    CanPayit: CanPayNum,
    PeopleNum: PeopleNum,
    ProfileImageUrl: ProfileImageUrl,
    TimeStamp: EpochTime
    
  })
  .then(() => DeleteMyLocation(ReplaceUserEmail));


  // 현재 위치를 db에 업데이트시키는 코드 
}

const RemoveIdentityToken = async () => {
  AsyncStorage.removeItem('IdentityToken');
  // let id = await AsyncStorage.getItem('IdentityToken');
  // let id2 = await AsyncStorage.getItem("ProfileImageUrl");

  // console.log(id, id2)

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

const MapScreen = () => {

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
    // 현재위치를 state화
    GetLocation(setLocation)
    // 로케이션 위치 가져오는 권한설정
    GetLocationPermission()
    // 푸쉬알림 권한설정 
    requestPushNotificationPermission()

    SaveEmailInDevice(myContext)
    SaveProfileImageUrlInDevice(myContext)
    SaveGenderInDevice(myContext)

    fcmService.register(onRegister, onNotification,onOpenNotification);
    localNotificationService.configure(onOpenNotification);

  }, []);

  const [ GpsOn, setGpsOn] = useState(false);

  const [ ModalVisiable, setModalVisiable] = useState(false);
  const [ Memo, setMemo] = useState("");
  const [ PeopleNum, setPeopleNum] = useState(1);
  const [ MoenyRadioBox, setMoneyRadioBox] = useState(0)

  const [second, setSecond] = useState<number>(180);

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
        UpdateMyLocation(myContext.userEmail,Memo, PeopleNum, MoenyRadioBox, location)
        setGpsOn(true)
        ChangeModalVisiable()
    } else {
      Alert.alert("10시부터 새벽7시까지 이용 가능합니다.")
    }
 
  }
  const {data, isLoading, refetch} = useQuery("QueryLocation", Get_Query_AllLocation)

  useEffect(()=>{
    refetch
    
  }, [updatenum])

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

  const MinusIcon = <TouchableOpacity style={MapScreenStyles.MinusPeopleNumber}
  onPress={() => {setPeopleNum(PeopleNum - 1)}}>
  <AntDesgin name='minus' size={30} color="white"/>
  </TouchableOpacity>

  const PlusIcon = <TouchableOpacity style={MapScreenStyles.MinusPeopleNumber} 
  onPress={() => {setPeopleNum(PeopleNum + 1)}}>
  <AntDesgin name='plus' size={30} color="white"/>
  </TouchableOpacity>

  return (
    <View style={{width:'100%', height:'100%'}}>
      <Modal 
        animationType="slide"
        transparent={true}
        visible={ModalVisiable}
      >
        <SafeAreaView
          style={MapScreenStyles.Memomodal}
        >
          <View style={{
              display:'flex',
              flexDirection:'row',
              width:'100%',
              height:50,
            }}>
            <TextInput
              value={Memo}
              onChangeText={(text) => setMemo(text)}
              style={MapScreenStyles.MemoTextInput}>
            </TextInput>

            <TouchableOpacity 
            style={[styles.RowCenter,MapScreenStyles.MoneyOption]}
            onPress={()=>{
              ChangeModalVisiable()}}
            >
              <MaterialIcons name='cancel' color="white" size={30}/>
            </TouchableOpacity>            
          </View>

            <View style={MapScreenStyles.PeopleNumOption}>
              <View style={[styles.Row_OnlyColumnCenter]}>
                <Icon name='person-add' size={30} color="white"/>
                <Text style={{color:'white'}}>인원</Text>
            </View>

              <View style={[{width:'50%',justifyContent:'flex-end'}, styles.Row_OnlyColumnCenter]}>
                {MinusIcon}
                <View style={[styles.RowCenter,{width:'30%', height:'100%'}]}>
                  <Text style={[styles.WhiteColor,MapScreenStyles.TotalPeopleNum]}>{PeopleNum}</Text>
                </View>
                {PlusIcon}
              </View>
            </View>
            
            <View style={[styles.RowCenter, MapScreenStyles.MoneyOptionView]}>
              <TouchableOpacity 
              onPress={()=>{setMoneyRadioBox(1)}}
              style={MoenyRadioBox == 1 ? MapScreenStyles.SelectedMoneyIconBox:MapScreenStyles.MoneyIconBox}
              >
                <MaterialIcons name='attach-money' size={50} color="white"/>
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={()=>{setMoneyRadioBox(2)}}
              style={MoenyRadioBox == 2 ? MapScreenStyles.SelectedMoneyIconBox:MapScreenStyles.MoneyIconBox}
              >
                <MaterialIcons name='money-off' size={50} color="white" />
              </TouchableOpacity>

            </View>

            <TouchableOpacity 
            style={[styles.RowCenter,MapScreenStyles.CheckBoxView]}
            
            onPress={()=>{
              ShowMyLocation()
              
              // PushAxios()
            
            }}
            >
              <AntDesgin name='checksquareo' color="white" size={30}/>

            </TouchableOpacity>

          
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
          maxZoomLevel={16}
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
      <SafeAreaView style={{position:'absolute', left:'5%', top:'5%'}}>
        {/* 리팩토링 필요 */}
        {GpsOn == false ? 
        <Text style={{color:'#202632', fontWeight:'600',fontSize:22}}>위치 Off!
        </Text>
        : <Text style={{color:'red', fontWeight:'600',fontSize:22}}>위치 On!
        </Text>}

        {GpsOn == false ? 
        <Text style={{color:'#202632', fontSize:22, fontWeight:'600'}}>
        {Math.floor(second / 60)} : {second % 60}
        </Text>
        :  <Text style={{color:'red', fontSize:22, fontWeight:'600'}}>
        {Math.floor(second / 60)} : {second % 60}
        </Text>}
        
       
      </SafeAreaView> 
      : null}

      {myContext.userGender == "Grils" ? 
          <View style={[
            styles.NoFlexDirectionCenter,
            MapScreenStyles.ChangeProfileView]}>
            <TouchableOpacity 
            style={[{
              backgroundColor:'#202632',
              // backgroundColor:'red',
              borderRadius:25,
              width:30,
              height:30
              // Frist
            },styles.NoFlexDirectionCenter]}
            onPress={()=>{
              RemoveIdentityToken()
              // forceUpdate()
              // ChangeMyProfileImage(myContext.userEmail)
            }}>
              <Icon name='person' size={26} color='white'/>
            </TouchableOpacity>

          </View> 
      :null}         

      {myContext.userGender == "Grils" ? 
       <TouchableOpacity style={[MapScreenStyles.StartView, styles.NoFlexDirectionCenter,]}
        onPress={()=> {
          // AndroidPushNoti()
        ChangeModalVisiable()
        }}
       >
        <Text style={{color:'white'}}>시작!!</Text>
      </TouchableOpacity>
      : null}
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
        distanceFilter: 3,
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


const MapScreenStyles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  Memomodal: {
    height:'30%',
    // flex:1,
    width:'90%',
    position:'absolute',
    // marginTop:'80%',
    backgroundColor:'black',
    top:'30%',
    left:'5%',
    borderRadius:25,
    // borderTopStartRadius:25,
    // borderTopEndRadius:25
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around'
  },
  MinusPeopleNumber : {
    width:35,
    height:35,
    borderRadius:25,
    borderColor:'white',
    borderWidth:1,
    // backgroundColor:'blue'
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  
  TotalPeopleNum : {
    marginHorizontal:10,
    fontSize:20,
  },

  MoneyIconBox: {
    borderRadius:10,
    marginRight:30
  },

  SelectedMoneyIconBox: {
    backgroundColor:'#2DB400',
    borderRadius:10,
    marginRight:30
  },

  MemoTextInput: {
    width: '70%',
    height: 50,
    backgroundColor: 'gray',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'lightgray',
    borderRadius: 10,
    marginLeft: '5%',
    padding: 10,
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
    width:'90%',
    height:50,
    marginLeft:'5%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  
  MoneyOptionView: {
    marginLeft:'5%',
    height:'25%',
    width:'90%'
  },
  
  CheckBoxView :{
    height: 50,
    width:'90%',
    borderWidth:2,
    borderStyle:'solid',
    borderColor:'lightgray',
    borderRadius:10,
    backgroundColor:'red',
    // marginLeft:'42.5%',
    marginLeft:'5%'
  },
  ChangeProfileView : {
    width:'10%',
    height:'5%',
    borderRadius:5,
    position:'absolute',
    left:'88%',
    top:'12%',
    // 11/08) 여기는 젤리처럼 그레디언트 컬러 필요함.
    // backgroundColor:'#0064FF',
    backgroundColor:'#202632',
    // backgroundColor:'#4EB789',
    // phonering 보라
    // backgroundColor:'#6E01EF',

    
  },

  StartView :{
    width:'20%',
    height:50,
    backgroundColor:'#202632',
    position:'absolute',
    left:'40%',
    bottom:'10%',
    borderRadius:25
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

});

export default codePush(MapScreen);

