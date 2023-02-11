import {StyleSheet, Dimensions} from 'react-native';
import styles from './ManToManBoard';
let {height} = Dimensions.get('window');
height = Math.ceil(height);
let NS2 = height * 0.65;
let H10 = height * 0.1;
let H5 = height * 0.05;

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
    backgroundColor: '#313A5B',
    // backgroundColor: 'white',
    left: '5%',
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  TotalPeopleNum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#37375B',
  },

  ChatView: [
    styles.RowCenter,
    {
      width: '100%',
      height: '30%',
    },
  ],

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
    // width: '78%',
    // height: 46,
    padding: 5,
    flex: 1,
    // backgroundColor: 'red',
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
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '50%',
    // backgroundColor: '#3E3E3E',
    backgroundColor: '#DFE5F1',
    borderRadius: 8,
  },

  FriendAdd: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    // height: '50%',
    height: H5,

    backgroundColor: '#DFE5F1',
    // backgroundColor: 'red',
    borderRadius: 8,
  },

  Legacy_MoneyOptionView: {
    // height:'25%',
    width: '100%',
    justifyContent: 'space-between',
  },

  PayOption: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70%',
  },

  CheckBoxView: {
    height: 46,
    width: '42.5%',
    borderRadius: 9,
    marginLeft: '5%',
  },

  CancelBoxView: {
    height: 46,
    width: '42.5%',
    borderRadius: 9,
    backgroundColor: '#DFE5F1',
    marginLeft: '5%',
  },
  ChangeProfileView: {
    width: 46,
    height: 46,
    borderRadius: 50,
    position: 'absolute',
    right: '7%',
    top: '6%',
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
    width: '70%',
    height: 50,
    // backgroundColor:'#202632',
    // backgroundColor: '#202124',
    position: 'absolute',
    left: '15%',
    bottom: '6%',
    borderRadius: 10,
  },

  ClickedBottomBar: {
    width: '40%',
    position: 'absolute',
    left: '30%',
    bottom: '15%',
  },

  Btn_MatchStart: {
    position: 'absolute',
    left: '5%',
    bottom: '6%',
  },

  Btn_Match: {
    position: 'absolute',
    left: '15%',
    bottom: '50%',
  },
  Btn_RandomMatch: {
    position: 'absolute',
    right: '15%',
    bottom: '50%',
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
    bottom: 80,
    // backgroundColor: 'white',
  },

  MatchModal: [styles.W100H100, {backgroundColor: 'black'}],

  M3MainAside: [
    styles.Column_OnlyRowCenter,
    {
      width: '18%',
      height: '100%',
    },
  ],
  M3MainSection: [
    styles.Column_OnlyColumnCenter,
    {
      width: '82%',
      height: '100%',
    },
  ],
  M3MainSectionText: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  M3Main_PayOption: [
    styles.ColumnCenter,
    {
      width: '100%',
      height: '100%',
      borderRadius: 14.25,
      backgroundColor: '#DFE5F1',
    },
  ],

  ImageBar: [
    styles.Row_OnlyColumnCenter,
    {
      width: '100%',
      justifyContent: 'space-around',
      marginTop: 15,
    },
  ],
  ImageBarBox: [
    styles.Row_OnlyColumnCenter,
    {
      width: 140,
      height: 45,
      backgroundColor: '#37375B',
      borderRadius: 22,
      justifyContent: 'space-around',
    },
  ],
  ImageBarText: {
    fontWeight: '600',
    color: 'white',
  },
});
