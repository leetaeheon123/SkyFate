import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Modal,
  Pressable,
  Dimensions,
  FlatList,
  Platform,
  TextInput
} from 'react-native';

import { useQuery } from 'react-query';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native'

import styles from '../../styles/ManToManBoard'
import { ManToManBoardSampleList } from '../../SampleData/Data';
import { GetTime } from '../UsefulFunctions/GetTime';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import { TouchableOpacity } from 'react-native-gesture-handler';

const reference = firebase
  .app()
  .database(
    'https://hunt-d7d89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );


// const sto = firebase.app().storage('gs://hunt-d7d89.appspot.com')
const Today = GetTime()

//In FlastList RenderItem

const Item = ({item, onPress}:any) => (
  <TouchableOpacity style={{
    width:'100%',
    height:100,
    marginBottom: 10,
    backgroundColor:'blue',
    display:'flex',
    flexDirection:'row'
  }}
  onPress={onPress}
  >
    {/* <View>
      <AutoHeightImage width={150} source={{uri:'https://thumb.mt.co.kr/06/2021/04/2021042213221223956_1.jpg/dims/optimize/'}} />
    </View>
    <Text>Hello World</Text> */}
    <Image 
      source={{uri:item.ImageUri}}
      style={{width: '18%', height: '90%', margin:0}}
      // resizeMode="contain"
    />
    <View>
    {/* HowManyPay: 100000,
    Picture: "PictureUrl",
    description : "현재 2명잡혀있음 22 23 예쁨",
    levelofgame : 4.5,
    title : "메이드1명구함", */}
      <Text>{item != null ? item.Title : null }</Text>
      <Text>{item != null ? item.Description :null }</Text>
      <Text>{item != null ? item.HowMuchPayIt :null }</Text>

      <Button title='console' onPress={()=>{
        console.log(item)
      }}/>
    </View>
  </TouchableOpacity>
)

const GetAllWriting = () => {
    const databaseDirectory = `/ManToManBoard/GangNam/${Today}`;

    return (
      reference
      .ref(databaseDirectory)
      .once('value')
      .then(snapshot => {
        let target = []
        let val = snapshot.exists()

        {val == false 
        ?
          target = [{
          CreatedAt: new Date().toLocaleString(),
          CreatedAtIntl: new Intl.DateTimeFormat('kr').format(new Date()),
          Description:"첫번째 게시글의 주인공이 되어주세요!!",
          HowMuchPayIt:1000*1000,
          LevelofGame:99,
          Title:"아직 오늘 게시된 글이 없습니다.",
          UserName:"이태헌",
          UserUid:"8269apk@naver.com",
          id:100 * 100
        }] 
        :
          target = Object.values(snapshot.val())
        }

        // target = Object.values(val)
        return target
      }).then((AllWritingList)=>{
        return AllWritingList
      })
    )
  
}

const PutInStorage = async (ImageUri:any, DatabaseUri:string, idvar2:any) => {
  const reference = storage().ref(`${DatabaseUri}/${idvar2}`)
  await reference.putFile(ImageUri)
  const StorageUrl = await reference.getDownloadURL()
  return StorageUrl
}

const isEmpty = function(value:any){
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    return true
  }else{
    return false
  }

};
// HowMuchPayIt은 string으로 받고 number로 형변환해서 저장한다.
const Submit = async (Title: string, HowMuchPayIt: string, Description:string, LevelofGame:number
  , navigation:any, ImageUri:string
  ) => {
    
  try {

    // const databaseDirectory = `/ManToManBoard/GangNam/${Today}`;
    const databaseDirectory = `/ManToManBoard/GangNam/${Today}`;

    const idvar = await reference
    .ref(databaseDirectory)
    .once('value')

    // 오늘 날이 20220927이고, 2022 09 27 오전 0시 1분에 처음 글을쓰면 idvar에는 null값이 담긴다.
    // 따라서 null이면 idvar2에 0을 넣어준다. 에러처리 코드임 ! 
    
    const idvar2 = idvar.exists() == false ? 0 : idvar.val().length
    // 지역 구하는 코드 추가하기  

    // 20220925 부분 구하는 코드 추가하기 

    // 유저 uid 구하는 코드 추가하기 

    let StorageUrl;
    await PutInStorage(ImageUri, databaseDirectory, idvar2).then((doc)=>{
      StorageUrl = doc
    })

    reference.ref(`/ManToManBoard/GangNam/${Today}/${idvar2}`).set({
      Title: Title,
      Description: Description,
      ImageUri:StorageUrl,
      HowMuchPayIt: Number(HowMuchPayIt),
      LevelofGame: Number(LevelofGame),
      CreatedAt: new Date().toLocaleString(),
      CreatedAtIntl: new Intl.DateTimeFormat('kr').format(new Date()),
      UserName: "이태헌",
      UserUid: "8269apk@naver.com",
      id: idvar2
    });

    console.log('Here')




  } catch (err) {
    console.log('error code:', err);
  } finally{
    console.log('finally')
  }
}

// 홍대,이태원 등 지역 구하는 코드 

// 유저uid 구하는 코드 

// 사진 업로드 코드 

// 사진 storage에 저장하는 코드 

const ImagePicker = (setImageUri: Function) => {
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
  , (res)=>{
    if (res.didCancel) return;
    setImageUri(res?.assets[0]?.uri);
  })

  // {!result.assets ? null : setImageUri(result.assets[0].uri)}
  
  // const result = await launchImageLibrary({});
}



const ManToManBoardScreen = () => {

    const navigation = useNavigation()

    const [ ModalVisiable, setModalVisiable] = useState(false);
    const [ImageUri , setImageUri] = useState('')

    // const AllWritingData =  useQuery("AllWriting", GetAllWriting).data
    // console.log(AllWritingData)
    const [ ManToManBoardList, setManToManBoardList] = useState([]);    

    useEffect(()=>{
      GetAllWriting().then((Li)=>{
        setManToManBoardList(Li)
      }).then(()=>{
        // 0927 +) 나중에 지워도 됌 
        // console.log(ManToManBoardList)
      })
    }, [])



    const [Title, onChangeTitle] = useState("Hello");
    const [HowMuchPayIt, onChangeHowMuchPayIt] = useState("10000");
    const [Description, onChagneDescription] = useState("Hello");
    const [LevelofGame, onChagneLevelofGame] = useState("2");

    // 0927+) usequery 예제코드. 지워도됌, 나중에 참고하라고 일단 달아놈 
    // const { isLoading, error, data, isFetching } = useQuery("AllWriting", GetAllWriting)
    
    const renderItem = ({item}:any) => {
      return (
        <Item
          item={item}
          onPress={()=>{
            console.log('Touch')
            navigation.navigate('ManToManBoardViewScreen',{item: item})
          }}
        />
       
      );
    };

    return (
        <SafeAreaView style={styles.centeredView}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={ModalVisiable}
            onRequestClose={() => {
              setModalVisiable(!ModalVisiable);
            }}
            >
            <View style={styles.WriteScreen}>
                <View style={[styles.line, {marginTop:'5%'}]}></View>
                <View style={[{width:'100%', height:'18%', backgroundColor:''},styles.Row_OnlyColumnCenter]}>
                  <Pressable style={[{backgroundColor:'#454545', width:'18%' ,margin:12, height:'100%', borderWidth:1, borderColor:'white',
                    borderRadius:3, }, styles.RowCenter]}
                    onPress={()=>{
                      ImagePicker(setImageUri)
                    }}
                  >
                    <View style={styles.ColumnCenter}>
                      <FontAwesome name='camera' size={24} color='white'/>
                      <Text style={{color:'white'}}>0/1</Text>
                    </View>

                  </Pressable>
                  {!ImageUri ? null: <Image style={{width:'18%', height:'100%'}}source={{uri: ImageUri}}></Image>}
                  
                </View>

                <View style={styles.line}/>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeTitle}
                  value={Title}
                  placeholder="제목"
                />
                <View style={styles.line}/>
{/* 2,3번은 ui ux 리서치 이후 개선하면 매우 좋을듯 - 092623:26분 작성. */}
                <TextInput
                style={[styles.input, {borderWidth:1, width:'35%'}]}
                onChangeText={(Money) => onChangeHowMuchPayIt(Money)}
                value={HowMuchPayIt}
                placeholder="얼마까지 지불할건가요 ??(과소비 금지!)"
                keyboardType="numeric"
                />
                <View style={styles.line}/>

                <TextInput
                style={styles.input}
                onChangeText={onChagneLevelofGame}
                value={LevelofGame}
                placeholder="사회성 점수를 적어주세요! (1~5)"
                keyboardType="numeric"
                />

                <View style={styles.line}/>


                <TextInput
                  style={styles.input}
                  onChangeText={onChagneDescription}
                  value={Description}
                  placeholder="파트너에게 요청하고싶은 내용을 적어주세요!"
                />
                <Button title="작성하기"
                onPress={()=>{
                    setModalVisiable(!ModalVisiable)
                    Submit(Title, HowMuchPayIt, Description, LevelofGame, navigation, ImageUri)
                }}
                />
               
                <Button title="닫기"
                onPress={()=>{
                    setModalVisiable(!ModalVisiable)
                }}
                />

            </View>


            
          </Modal>
          <View style={styles.modalView}>
            <Text style={styles.LocalNameText}>강남</Text>
            <Pressable
              onPress={()=>{
                console.log('Plus')
                setModalVisiable(!ModalVisiable)
                // Modal이 떠있는 상태에선 navigate가 동작하지 않음.
                // 글 작성부분도 modal로 가는 아이디어는 어떨가요 ? 
                // setWriteScreenModalVisiable(!WriteScreenModalVisiable)
                // setModalVisiable(false)
                // navigation.navigate('ManToManBoardWriteScreen')
              }}>
               <FontAwesome name='plus-square-o' size={24} color='white'/>
            </Pressable>
            <Pressable
              onPress={()=>{
                console.log('DM')
              }}>
               <Feather name='send' size={24} color='white'/>
            </Pressable>
          </View>

          {/* <Pressable onPress={onSelectImage}>
            <Text>Upload</Text>
            <Image
              style={{width: 200, height: 200}}
              source={{uri: response?.assets[0]?.uri}}
            />
          </Pressable> */}

          <SafeAreaView
            style={{
              height: '100%',
            }}>
            {/* {ModalButton()} */}
            
            <FlatList
              automaticallyAdjustContentInsets={false}
              contentContainerStyle={
                {
                  // paddingHorizontal: 20,
                }
              }
              data={ManToManBoardList}
              decelerationRate="fast"
              // Vertical
              // onScroll={onScroll}
              // keyExtractor={item => item.id}
              pagingEnabled
              renderItem={renderItem}
              // snapToInterval={IntDeviceHeight}
              snapToAlignment="start"
              showsHorizontalScrollIndicator={true}
            />

          </SafeAreaView>
        </SafeAreaView>
        
    )

}

export default ManToManBoardScreen