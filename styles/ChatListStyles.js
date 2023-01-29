import {StyleSheet, Dimensions} from 'react-native';
import styles from './ManToManBoard';
let {height} = Dimensions.get('window');
height = Math.ceil(height);
let NS2 = height * 0.7;

export const ChatListStyles = StyleSheet.create({
  Body: {
    width: '100%',
    height: '100%',
    backgroundColor: '#37375B',
  },
  Main: {
    width: '90%',
    height: '100%',
    marginLeft: '5%',
    // backgroundColor: 'red',
  },
  Explain: [
    styles.Column_OnlyRowCenter,
    {
      width: '100%',
      height: '34%',
      // backgroundColor: 'orange',
      justifyContent: 'space-evenly',
    },
  ],
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
});
