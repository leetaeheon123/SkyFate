import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import styles from '~/ManToManBoard';
import {CongratulateSvg} from 'component/Chat/ChatSvg';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {Type2가로} from './LinearGradient/LinearType';
import {
  AlreadyAttendFirstEventSvg,
  CompleteAttendFirstEventSvg,
  GoodSvg,
} from './Modal/Modasvg';
import AlreadyAttend from 'Assets/AlreadyAttend.png';
import CompleteAttend from 'Assets/CompleteAttend.png';

const width = Dimensions.get('window').width;

const ChooseModal = ({
  Vis,
  setVis,
  YesPressFun,
  NoPressFun,
  Title = '',
  Desc = '',
}) => (
  <Modal isVisible={Vis}>
    <LinearGradient
      colors={Type2가로}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[
        styles.Column_OnlyRowCenter,
        {
          width: '100%',
          height: 119,
          justifyContent: 'flex-end',
          borderRadius: 20,
        },
      ]}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '500',
          color: 'white',
        }}>
        {Title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '200',
          color: '#FFFFFF80',
          marginBottom: 15,
        }}>
        {Desc}
      </Text>
      <View
        style={[
          styles.W100,
          {height: 40, borderTopWidth: 0.5, borderTopColor: '#37375B15'},
          styles.Row_OnlyFlex,
        ]}>
        <TouchableOpacity
          style={[
            styles.RowCenter,
            styles.W50,
            {borderRightWidth: 0.5, borderRightColor: '#37375B15'},
          ]}
          onPress={() => {
            YesPressFun();

            // setTimeout(() => {
            //   setCongratulateModalVis(true);
            // }, 500);
          }}>
          <Text>네</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.RowCenter, styles.W50]}
          onPress={() => {
            NoPressFun();
          }}>
          <Text>아니요</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </Modal>
);

const CongratulateModal = ({Vis, setVis}) => (
  <Modal isVisible={Vis}>
    <TouchableOpacity
      onPress={() => {
        setVis(false);
      }}>
      {CongratulateSvg(width * 0.9)}
    </TouchableOpacity>
  </Modal>
);

const CompleteAttendFirstEventModal = ({Vis, setVis}) => (
  <Modal isVisible={Vis}>
    <TouchableOpacity
      style={[styles.RowCenter]}
      onPress={() => {
        setVis(false);
      }}>
      <Image source={CompleteAttend} style={{}} width={width * 0.9} />
    </TouchableOpacity>
  </Modal>
);

const AlreadyAttendModal = ({Vis, setVis}) => (
  <Modal
    isVisible={Vis}
    style={{
      marginLeft: 0,
      marginRight: 0,
    }}>
    <TouchableOpacity
      onPress={() => {
        setVis(false);
      }}>
      <Image
        source={AlreadyAttend}
        width={width * 0.8}
        style={
          {
            // backgroundColor: 'white',
          }
        }></Image>
    </TouchableOpacity>
  </Modal>
);

export {
  ChooseModal,
  CongratulateModal,
  CompleteAttendFirstEventModal,
  AlreadyAttendModal,
};
