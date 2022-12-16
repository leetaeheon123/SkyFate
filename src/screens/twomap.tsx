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
  ScrollView,
  Switch
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

import firestore from '@react-native-firebase/firestore';
import AntDesgin from "react-native-vector-icons/AntDesign"

import messaging from '@react-native-firebase/messaging';

import {fcmService} from "../UsefulFunctions/push.fcm"
import {localNotificationService} from "../UsefulFunctions/push.noti"
import axios from 'axios';

import { MapScreenStyles } from '../../styles/MapScreen';
import MarkerAnimationStyles from "../../styles/MarkerAnimation"
import Ring from './Ring';

import { Get_itaewon_HotPlaceList } from '../UsefulFunctions/HotPlaceList';

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

const Get_GtoGLocations = () => {
  const databaseDirectory = `/GtoGLocations`;
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



const FirebaseInput = (UserEmail:string, StorageUrl:string) => {

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
  const DBUrl = `/ProfileImage/${Gender}/${UserEmail}`
  // console.log("DBUrl:" , DBUrl)
  const reference = storage().ref(`${DBUrl}/ProfileImage`)
  // console.log("LocalImagePath",LocalImagePath)
  await reference.putFile(LocalImagePath)
  const StorageUrl = await reference.getDownloadURL()
  return StorageUrl
}

const saveProfileImageUrlInDevice = (StorageUrl:string)=>{
  AsyncStorage.setItem("ProfileImageUrl", StorageUrl);

}

const ChangeMyProfileImage = async (UserEmail:string, Gender:number) => {

  let fun = async (LocalImagePath:string) => {

    let StorageUrl:string = ""
    await PutInStorage(LocalImagePath,UserEmail,Gender).then((doc)=>{
      StorageUrl = doc
    })
   
    
    FirebaseInput(UserEmail, StorageUrl)
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
const logout = (navigation:any) => {
  RemoveIdentityToken()
  navigation.navigate('ValidInvitationCodeScreen')

}
const RemoveIdentityToken = async () => {
  AsyncStorage.removeItem('IdentityToken');
}
// 자주 바뀌는 데이터이므로 State화 하기 

const TwoMapScreen = (props:any) => {


  const navigation = useNavigation()

  const UserData = props.route.params

  console.log("UserData:",UserData)


  const [location, setLocation] = useState<ILocation | undefined>(undefined);

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
      // 푸쉬알림 권한설정 
      await requestPushNotificationPermission()
      await GetLocation(setLocation)
      // 현재위치를 state화 &추적

      // UpdateMyLocationWatch(setLocation)
    }

    SaveInDevice(); 

    const onChildAddInGtoG = database()
      .ref('/GtoGLocations')
      .on('child_added', snapshot => {
        GtoGLocationsRefetch()
      });

    // Stop listening for updates when no longer required
    return () => {
      database().ref('/GtoGLocations').off('child_added', onChildAddInGtoG);
    }

  }, []);

  const [ GpsOn, setGpsOn] = useState(false);

  function UpdateMyLocationForGtoG(){

    let ReplaceUserEmail = UserData.UserEmail.replace('.com','')
    const EpochTime = +new Date()

    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        console.log("MyLocationUpdateforGtoG In ForeGround")
          reference
          .ref(`/GtoGLocations/${ReplaceUserEmail}`)
          .update({
            latitude: latitude,
            longitude: longitude,
            ProfileImageUrl: UserData.ProfileImageUrl,
            TimeStamp: EpochTime
          })
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 300000, maximumAge: 10000 }
    );

  }

  useEffect(()=>{
   
    if(GpsOn == true){
      let Interval = setInterval(
        UpdateMyLocationForGtoG, 
      20000)
      return () => {
        clearInterval(Interval)
      }
    } 
  }, [GpsOn])

  const GpsSwitch = () => setGpsOn(previousState => !previousState);


  const [ ModalVisiable, setModalVisiable] = useState(false);
  const [ ProfileModalVisiable, setProfileModalVisiable] = useState(false);

  const [ Memo, setMemo] = useState("");
  const [ PeopleNum, setPeopleNum] = useState(1);
  const [ MoenyRadioBox, setMoneyRadioBox] = useState(0)

  const {width} = Dimensions.get('window')

  const ChangeModalVisiable = () => {
    setModalVisiable(previousState => !previousState)
  }

  const ShowMyLocation = () => {
    const date = new Date()
    let day = date.getHours()
    day = 23
    console.log(day)
    // day가 오후 10시 ~ 새벽 7시 
    if(day >= 22 && day <=24 || day >= 1 && day <= 7) {
        // UpdateMyLocation(UserData.UserEmail,Memo, PeopleNum, MoenyRadioBox, location)
        setGpsOn(true)
        ChangeModalVisiable()
    } else {
      Alert.alert("10시부터 새벽7시까지 이용 가능합니다.")
    }
 
  }
  const {data, isLoading, refetch:GtoGLocationsRefetch} = useQuery("GtoGLocations", Get_GtoGLocations)
  const {data:itaewon_HotPlaceList, isLoading:itaewon_HotPlaceListisLoading} = useQuery("itaewon_HotPlaceList2", Get_itaewon_HotPlaceList)

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
                ChangeMyProfileImage(UserData.UserEmail, UserData.Gender)
              }}>
                {
                ProfileImage() 
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
          {isLoading == false ? 
          data?.map((data,index)=>{
            return(
            <Marker
              key={data.latitude}
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude
              }}
              title={data?.FaceGrade}
              tracksViewChanges={false}
              description={'얼굴: ' + data?.FaceGrade + '점 매너: ' + data?.MannerGrade + "점 사회성: " + data?.SocialGrade +"점 "}

              onPress={()=>{
                console.log("Hello")
                setProfileModalVisiable(!ProfileModalVisiable)
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

      {UserData.Gender == "2" ? 
      <SafeAreaView style={[styles.Row_OnlyColumnCenter,MapScreenStyles.TopView]}>
          <Text style={{color:'white', fontWeight:'500', fontSize:14}}>나의위치 표시하기</Text>
          <Switch
          trackColor={{false: '#202124', true: '#202124'}}
          thumbColor={GpsOn ? '#28FF98' : '#f4f3f4'}
          ios_backgroundColor="#202124"
          onValueChange={GpsSwitch}
          value={GpsOn}
          />
          {GpsOn == false ? 
          <View style={[styles.NoFlexDirectionCenter,{width:38, height:22, 
            backgroundColor:'#B4B4B4', borderRadius:4}]}>
            <Text style={{fontWeight:'500', fontSize:14}}>OFF</Text>
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
          <Image 
          source={{uri:UserData.ProfileImageUrl}}
          style={{width: 43, height: 43, borderRadius:35}}
          />
        </TouchableOpacity>
      </View> 
        

      {UserData.Gender == 2 ? 
       <TouchableOpacity style={[MapScreenStyles.StartView, styles.NoFlexDirectionCenter,]}
        onPress={()=> {
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




export default codePush(TwoMapScreen);



