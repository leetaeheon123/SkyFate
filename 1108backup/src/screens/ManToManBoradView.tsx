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
import styles from '../../styles/ManToManBoard';
import Icon from 'react-native-vector-icons/AntDesign'

import AutoHeightImage from 'react-native-auto-height-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const ManToManBoardViewScreen = ({route}:any) => {

  const line = () => <View style={[ViewStyle.width , {height:1, backgroundColor:'white'} ]}></View>
  const DeviceWidth = Dimensions.get('window').width * 0.9
  const item = route.params.item
  const navigation = useNavigation()
  return (
    // 배경색 설정하기 
    <SafeAreaView style={{width:'100%', height:'100%', backgroundColor:'darkgray'}}>
      <View style={{width:'90%', height:'100%', marginLeft:'5%'}}>
        <View style={[ViewStyle.width,{height: '5%'}]}>
          <TouchableOpacity onPress={()=>{navigation.goBack()}}>
            <Icon name='left' size={24} color='white'/>
          </TouchableOpacity>
        </View>
        {line()}
        <View style={[ViewStyle.width, styles.Row_OnlyColumnCenter, {height:'10%'}]}>
          {/* 이부분 사용자 imageuri로 변경 필요  */}
          <Image source={{uri: item.ImageUri}} 
            style={{width:30, height:30, borderRadius:25}}/>
            {/* 몇시간 전인지 이전에 board에서 받아오기  */}
          <View style={{marginLeft: 10}}>
            <Text style={{color:'black'}}>{item.UserName}</Text>
            <Text>5시간 전</Text>
          </View>
        </View>
        {line()}
        <View style={[styles.Row_OnlyColumnCenter, {marginBottom:20, marginTop:20}]}>
          <Text style={{color:'orange', fontWeight:'bold', fontSize:20}}>모집 중</Text>
          <Text style={{marginLeft: 10, fontSize:20}}>{item.Title}</Text>
        </View>

        <Text>Flex할 액수:{item.HowMuchPayIt}원</Text>

        <View style={[, {marginTop:20}]}>
          {/* 이부분 넘어온 image가 없으면 에러처리하기 */}
          <View>
            <AutoHeightImage width={DeviceWidth} source={{uri:item.ImageUri}} />
          </View> 
          <Text style={{marginTop: 20}}>{item.Description}</Text>

        </View>
          
        {/* <Button title="Bu" onPress={()=>{
          console.log(item)
        }}></Button> */}
        </View>

     
    </SafeAreaView>
      
  )

}

const ViewStyle = StyleSheet.create({
  width: {
    width:'100%',
  }
})

export default ManToManBoardViewScreen