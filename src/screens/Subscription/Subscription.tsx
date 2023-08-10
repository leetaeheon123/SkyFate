import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {HPer100, HPer15, HPer50, HPer90, WPer100, WPer90} from '~/Per';

import Modal from 'react-native-modal';
import styles from '~/ManToManBoard';
const SubscriptionScreen = ({}) => {
  const [ModalVis, setModalVis] = useState(true);

  return (
    <SafeAreaView style={SubscriptionScreenStyle.Continer}>
      <Text>Hello</Text>
      <Modal
        animationIn="slideInUp"
        isVisible={ModalVis}
        // onBackdropPress={() => setModalVis(false)}
        style={[
          styles.FullModal,
          {
            backgroundColor: 'skyblue',
            width: WPer100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          },
        ]}>
        <View style={SubscriptionScreenStyle.ModalBox}>
          <Text style={SubscriptionScreenStyle.Title}>
            센슈얼 플러스 구독하기
          </Text>
          <View style={SubscriptionScreenStyle.SubscriptionBox}></View>
          <View style={SubscriptionScreenStyle.SubscriptionBox}></View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const SubscriptionScreenStyle = StyleSheet.create({
  Continer: {
    width: WPer100,
    height: HPer100,
  },

  ModalBox: {
    height: HPer50,
    width: WPer100,
    backgroundColor: 'red',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  SubscriptionBox: {
    width: WPer90,
    marginLeft: '5%',
    height: HPer15,
    backgroundColor: 'black',
    borderRadius: 16,
  },
  Title: {
    fontWeight: '700',
    fontSize: 24,
  },
});

export default SubscriptionScreen;
