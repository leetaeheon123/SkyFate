import {StyleSheet} from 'react-native';
styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 100,
    backgroundColor: 'gray',
  },
  W90ML5: {
    width: '90%',
    marginLeft: '5%',
  },
  W100H25: {
    width: '100%',
    height: '25%',
  },
  W100H20: {
    width: '100%',
    height: '20%',
  },
  W100H15: {
    width: '100%',
    height: '15%',
  },
  W100: {
    width: '100%',
  },
  W50: {
    width: '50%',
  },
  FW500FS14: {
    fontWeight: '500',
    fontSize: 14,
  },
  FWMe: {
    fontWeight: '500',
  },
  FS16: {
    fontSize: 16,
  },
  Marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  itaewon_HP_Marker: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'black',
  },
  modalView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // margin: 20,
    // backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    // alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  LocalNameText: {
    marginBottom: 15,
    fontSize: 24,

    // textAlign: "center"
  },

  // Write 부분

  WriteScreen: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    position: 'relative',
    top: '50%',
    borderRadius: 25,
  },

  input: {
    height: 40,
    margin: 12,
    // borderWidth: 1,
    // padding: 10,
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgray',
  },

  // 둘 다 쓰는곳

  RowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Row_OnlyFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  Row_OnlyRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  Row_OnlyColumnCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Column_OnlyFlex: {
    display: 'flex',
    flexDirection: 'column',
  },
  Column_OnlyRowCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  Column_OnlyColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  NoFlexDirectionCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  WhiteColor: {
    color: 'white',
  },
  DefaultBorder: {
    borderWidth: 1,
    borderStyle: 'solid',
  },
  W100H100: {
    width: '100%',
    height: '100%',
  },

  FullModal: {
    right: '5%',
    marginTop: 0,
    marginBottom: 0,
  },
});

export default styles;
