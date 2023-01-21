import {StyleSheet, Dimensions} from 'react-native';
import styles from './ManToManBoard';
let {height} = Dimensions.get('window');
height = Math.ceil(height);
let NS2 = height * 0.7;

export const MapScreenStyles = StyleSheet.create({
  ProfileModalParent: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    backgroundColor: '#37375B',
    top: '10%',
    right: '5%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  ProfileModalScrollView: {
    width: '90%',
    marginLeft: '5%',
  },
  TopView: {
    position: 'absolute',
    left: '5%',
    top: '6%',
    width: '68%',
    height: 46,
    backgroundColor: '#606060',
    borderRadius: 6,
    justifyContent: 'space-around',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  Memomodal: {
    height: NS2,
    top: '14%',
    width: '90%',
    position: 'absolute',
    backgroundColor: 'black',
    // backgroundColor: 'white',
    left: '5%',
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  MinusPeopleNumber: {
    width: 18,
    height: 18,
    backgroundColor: '#565656',
  },

  PlusPeopleNumber: {
    width: 18,
    height: 18,
    backgroundColor: 'white',
  },

  TotalPeopleNum: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  MoneyIconBox: [
    {
      width: 63,
      height: 30,
      borderRadius: 4,
      backgroundColor: '#3E3E3E',
    },
    styles.NoFlexDirectionCenter,
  ],

  SelectedMoneyIconBox: [
    {
      backgroundColor: '#28FF98',
      width: 63,
      height: 30,
      borderRadius: 4,
    },
    styles.NoFlexDirectionCenter,
  ],

  MemoTextInput: {
    width: '100%',
    height: 46,
    backgroundColor: '#3E3E3E',
    borderRadius: 6,
    padding: 15,
  },

  MoneyOption: {
    height: 50,
    width: '15%',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'lightgray',
    borderRadius: 10,
    backgroundColor: 'red',
    marginLeft: '5%',
  },

  PeopleNumOption: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 46,
    backgroundColor: '#3E3E3E',
    borderRadius: 6,
  },

  MoneyOptionView: {
    // height:'25%',
    width: '100%',
    justifyContent: 'space-between',
  },

  CheckBoxView: {
    height: 46,
    width: '42.5%',
    borderRadius: 6,
    marginLeft: '5%',
  },

  CancelBoxView: {
    height: 46,
    width: '42.5%',
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    marginLeft: '5%',
  },
  ChangeProfileView: {
    width: 46,
    height: 46,
    borderRadius: 50,
    position: 'absolute',
    right: '7%',
    top: '6%',
    // 11/08) 여기는 젤리처럼 그레디언트 컬러 필요함.
    // backgroundColor:'#0064FF',
    // backgroundColor:'#202632',
    // backgroundColor:'#4EB789',
    // phonering 보라
    // backgroundColor:'#6E01EF',
    borderWidth: 3,
    borderColor: '#202124',
    borderStyle: 'solid',
  },

  NS: {
    width: '20%',
    height: 46,
    borderRadius: 50,
    position: 'absolute',
    right: '7%',
    top: '6%',
  },

  MyLocationBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    elevation: 3,
    right: '3%',
    bottom: 130,
    backgroundColor: 'white',
  },

  StartView: {
    width: '90%',
    height: 50,
    // backgroundColor:'#202632',
    backgroundColor: '#202124',
    position: 'absolute',
    left: '5%',
    bottom: '6%',
    borderRadius: 10,
  },

  Btn_MatchStart: {
    position: 'absolute',
    left: '5%',
    bottom: '6%',
  },

  Btn_Match: {
    position: 'absolute',
    left: '15%',
    bottom: '30%',
  },
  Btn_RandomMatch: {
    position: 'absolute',
    right: '15%',
    bottom: '30%',
  },

  GirlsMarker: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  HP_Marker: {
    width: 24,
    height: 24,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
  },

  WhiteText: {
    color: 'white',
  },
  MyLocationBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    elevation: 3,
    right: '3%',
    bottom: 130,
    backgroundColor: 'white',
  },
});
