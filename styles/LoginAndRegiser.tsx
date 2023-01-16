import {StyleSheet} from 'react-native';
export const LoginAndReigsterStyles = StyleSheet.create({
  Body: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  CheckBox: {
    width: '100%',
    // height: '10%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0064FF',
    borderRadius: 25,
    position: 'absolute',
    bottom: '8%',
  },
  Btn_Clickable: {
    position: 'absolute',
    bottom: '8%',
  },
  CheckText: {
    fontSize: 16,
    color: 'white',
  },
  CheckBt: {
    width: '90%',
    height: 55,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '##0064FF',
  },
  Main: {
    width: '90%',
    height: '100%',
    marginLeft: '5%',
  },
  Description: {
    height: '15%',
    width: '100%',
    backgroundColor: 'skyblue',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  Center: {
    height: '50%',
    width: '100%',
  },
});

export const LoginAndRegisterTextInputStyle = (BorderBottomColor: any) =>
  StyleSheet.create({
    TextInput: {
      width: '100%',
      height: '50%',
      borderBottomColor: BorderBottomColor,
      borderBottomWidth: 1,
      fontSize: 18,
      fontWeight: '600',
      color: 'black',
    },
    ViewStyle: {
      width: '100%',
      // height: '40%',
      height: 144,
      marginTop: '5%',
      display: 'flex',
      justifyContent: 'center',
    },
  });
