import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from 'react';
import {
  Alert,
  Platform,
  Image,
  Dimensions,
  AppState,
  Button,
  FlatList,
  KeyboardAvoidingView,
  NativeModules,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {withAppContext} from '../contextReducer';
import {chatReducer} from '../reducer/chat';
import Message from '../component/message';
import {createChannelName} from '../utilsReducer';

import {AppContext} from '../UsefulFunctions/Appcontext';
import {GetTime} from '../../1108backup/src/UsefulFunctions/GetTime';
import firestore from '@react-native-firebase/firestore';

import {GetEpochTime, MilisToMinutes} from '^/GetTime';
import styles from '~/ManToManBoard';
import {BombIconViewNotabs} from 'component/General';
import {useInterval} from '../utils';
import {useKeyboard} from '@react-native-community/hooks';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {Type2가로} from 'component/LinearGradient/LinearType';
import {
  ChatLeaveSvg,
  ChatReportSvg,
  CongratulateSvg,
  L1InviteSvg,
} from 'component/Chat/ChatSvg';
import {UpdateFbFirestore} from '^/Firebase';
import {WhiteReportSvg, 취소하기Svg} from 'component/Report/Report';
import {GetUserData} from '^/SaveUserDataInDevice';
import Swiper from 'react-native-swiper';
import {launchImageLibrary} from 'react-native-image-picker';

const NoTimeLimiteChatScreen = (props) => {
  const {route, navigation} = props;

  const {channel} = route.params;
  const {UserData} = route.params;

  // members 배열에서 UserEmail 값이 UserData.UserEmail과 동일한 요소를 제거함

  const otherUserData = channel.members.filter(
    (data) => data.userId != UserData.UserEmail,
  );

  const [OtherUserAllData, setUserData] = useState();
  const [FiliterImageArray, setImageArray] = useState();

  const Statelize = async () => {
    const UserData = await GetUserData(otherUserData[0].userId);
    setUserData(UserData);
    const ImageArray = [
      UserData.ProfileImageUrl,
      UserData.ProfileImageUrl2,
      UserData.ProfileImageUrl3,
      UserData.ProfileImageUrl4,
      UserData.ProfileImageUrl5,
      UserData.ProfileImageUrl6,
    ];
    setImageArray(ImageArray.filter((data) => data != '' && data != undefined));
  };

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const [query, setQuery] = useState(null);
  const [state, dispatch] = useReducer(chatReducer, {
    SendBird,
    channel,
    messages: [],
    messageMap: {}, // redId => boolean
    loading: false,
    input: '',
    empty: '',
    error: '',
  });

  useLayoutEffect(() => {
    const right = (
      <View style={style.headerRightContainer}>
        {/* {CanSendL1Invite == 0 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={style.headerRightButton}
            onPress={() => {
              sendL1InviteAndResUserMessage(
                'L1_Invite',
                `${UserData.NickName}님께서 둘만의 지도로 이동하자고 요청하셨습니다.`,
              );
            }}>
            {L1InviteSvg(45)}
          </TouchableOpacity>
        ) : null} */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={style.headerRightButton}
          onPress={leave}>
          {ChatLeaveSvg}
        </TouchableOpacity>
      </View>
    );

    navigation.setOptions({
      title: otherUserData[0].nickname,
      headerRight: () => right,
      headerStyle: {
        backgroundColor: '#7373F6',
      },
      headerTintColor: '#fff',
    });
  });
  // on state change
  useEffect(() => {
    SendBird.addConnectionHandler('chat', connectionHandler);
    SendBird.addChannelHandler('chat', channelHandler);
    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    refresh();

    return () => {
      SendBird.removeConnectionHandler('chat');
      SendBird.removeChannelHandler('chat');
      unsubscribe.remove();
    };
  }, []);

  /// on query refresh
  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

  useEffect(() => {
    const Init = async () => {
      await Statelize();
    };
    Init();
  }, []);

  /// on connection event
  const connectionHandler = new SendBird.ConnectionHandler();
  connectionHandler.onReconnectStarted = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connecting..',
      },
    });
  };
  connectionHandler.onReconnectSucceeded = () => {
    dispatch({
      type: 'error',
      payload: {
        error: '',
      },
    });
    refresh();
  };
  connectionHandler.onReconnectFailed = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connection failed. Please check the network status.',
      },
    });
  };

  /// on channel event
  const channelHandler = new SendBird.ChannelHandler();
  channelHandler.onMessageReceived = (targetChannel, message) => {
    if (targetChannel.url === channel.url) {
      dispatch({type: 'receive-message', payload: {message, channel}});
    }
  };
  channelHandler.onMessageUpdated = (targetChannel, message) => {
    if (targetChannel.url === channel.url) {
      dispatch({type: 'update-message', payload: {message}});
    }
  };
  channelHandler.onMessageDeleted = (targetChannel, messageId) => {
    if (targetChannel.url === channel.url) {
      dispatch({type: 'delete-message', payload: {messageId}});
    }
  };
  channelHandler.onUserLeft = (channel, user) => {
    if (user.userId === UserData.UserEmail) {
      navigation.navigate('IndicatorScreen', {
        action: 'leave',
        data: {channel},
      });
    }
  };
  channelHandler.onChannelDeleted = (channel) => {
    navigation.navigate('IndicatorScreen', {
      action: 'deleteInServer',
      data: {channel},
    });
  };

  const handleStateChange = (newState) => {
    if (newState === 'active') {
      SendBird.setForegroundState();
    } else {
      SendBird.setBackgroundState();
    }
  };
  const leave = () => {
    Alert.alert('Leave', 'Are you going to leave this channel?', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('IndicatorScreen', {
            action: 'leave',
            data: {channel},
          });
        },
      },
    ]);
  };

  const [ProfileViewModalVis, setProfileViewModalVis] = useState(false);

  const MainImage = () => {
    return (
      <View
        style={{
          width: '95%',
          marginLeft: '2.5%',
          height: '95%',
          borderRadius: 31,
          marginTop: 10,
        }}>
        <Swiper
          paginationStyle={{
            width: '70%',
            height: 2.5,
            position: 'absolute',
            top: 24,
            left: '15%',
            display: 'flex',
            flexDirection: 'row',
            zIndex: 10,
          }}
          dot={
            <View
              style={{
                height: '100%',
                width: `${100 / FiliterImageArray.length}%`,
                backgroundColor: '#00000014',
                borderRadius: 4,
              }}></View>
          }
          activeDot={
            <View
              style={{
                height: '100%',
                width: `${100 / FiliterImageArray.length}%`,
                backgroundColor: 'white',
                borderRadius: 4,
              }}></View>
          }>
          {FiliterImageArray.map((data, index) => {
            return (
              <Image
                key={index}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 31,
                }}
                source={{
                  uri: data,
                }}
              />
            );
          })}
        </Swiper>
      </View>
    );
  };

  const ProfileViewModal = (
    <Modal
      animationIn="slideInUp"
      isVisible={ProfileViewModalVis}
      coverScreen={false}
      onBackdropPress={() => setProfileViewModalVis(false)}>
      <View
        style={[
          styles.W95ML5,
          {height: '65%', backgroundColor: '#313A5B', borderRadius: 26},
        ]}>
        {FiliterImageArray != undefined ? MainImage() : null}
        {OtherUserAllData && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '20%',
              bottom: 0,
            }}>
            <View
              style={{
                marginLeft: 24,
                width: '50%',
              }}>
              <Text style={{color: 'white', fontWeight: '700', fontSize: 17}}>
                {OtherUserAllData.NickName} {OtherUserAllData.Age}
              </Text>
              <Text style={{color: 'white', marginTop: 5, fontWeight: '400'}}>
                {OtherUserAllData.Mbti}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
  const refresh = () => {
    // channel.markAsRead();
    setQuery(channel.createPreviousMessageListQuery());
    dispatch({type: 'refresh'});
  };
  const next = () => {
    if (query.hasMore) {
      dispatch({type: 'error', payload: {error: ''}});
      query.limit = 50;
      query.reverse = true;
      query.load((fetchedMessages, err) => {
        if (!err) {
          console.log('Success to get the messages.');
          // console.log('fetchedMessages In Chat page:', fetchedMessages);
          dispatch({
            type: 'fetch-messages',
            payload: {messages: fetchedMessages},
          });
        } else {
          console.log('Failed to get the messages.');
          dispatch({
            type: 'error',
            payload: {error: 'Failed to get the messages.'},
          });
        }
      });
    }
  };

  const sendUserMessage = () => {
    if (state.input.length > 0) {
      const params = new SendBird.UserMessageParams();
      params.message = state.input;

      const pendingMessage = channel.sendUserMessage(params, (message, err) => {
        if (!err) {
          dispatch({type: 'send-message', payload: {message}});
        } else {
          console.log('In SendUserMessaging Error:', err);
          setTimeout(() => {
            dispatch({
              type: 'error',
              payload: {error: 'Failed to send a message.'},
            });
            dispatch({
              type: 'delete-message',
              payload: {reqId: pendingMessage.reqId},
            });
          }, 500);
        }
      });
      dispatch({
        type: 'send-message',
        payload: {message: pendingMessage, clearInput: true},
      });
    }
  };

  const sendL1InviteAndResUserMessage = (Type, message) => {
    const params = new SendBird.UserMessageParams();
    params.message = message;
    params.customType = Type;

    const pendingMessage = channel.sendUserMessage(params, (message, err) => {
      if (!err) {
        // 이부분이 없으면 매세지를 보냈을 때 내 화면이 리로딩되지 않음
        dispatch({type: 'send-message', payload: {message}});
        SaveSendL1InviteInMetaData();
      } else {
        console.log('In SendUserMessaging Error:', err);
        setTimeout(() => {
          dispatch({
            type: 'error',
            payload: {error: 'Failed to send a message.'},
          });
          dispatch({
            type: 'delete-message',
            payload: {reqId: pendingMessage.reqId},
          });
        }, 500);
      }
    });
  };

  const SaveSendL1InviteInMetaData = () => {
    var Metadata = {
      [Key_MetaData]: '1', // Update an existing item with a new value.
    };

    setCanSendL1Invite(1);

    var upsertIfNotExist = true; // If false, the item with `key3` isn't added to the metadata.

    channel.updateMetaData(
      Metadata,
      upsertIfNotExist,
      function (response, error) {
        if (error) {
          // Handle error.
        }
      },
    );
  };

  const selectFile = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = await check(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (permission !== RESULTS.GRANTED) {
          const result = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );
          if (result !== RESULTS.GRANTED) {
            throw new Error(
              'Please allow the storage access permission request.',
            );
          }
        }
      } else if (Platform.OS === 'ios') {
        // TODO:
      }
      // const result = await DocumentPicker.pickSingle({
      //   type: [
      //     DocumentPicker.types.images,
      //     DocumentPicker.types.video,
      //     DocumentPicker.types.audio,
      //     DocumentPicker.types.plainText,
      //     DocumentPicker.types.zip,
      //   ],
      // });

      const result = await launchImageLibrary({
        mediaType: 'mixed',
        // maxWidth: 512,
        //     maxHeight: 512,
        videoQuality: 'high',
        // durationLimit: duration,
        quality: 1,
        //     cameraType: back,
        includeBase64: Platform.OS === 'android',
        includeExtra: false,
        saveToPhots: false,
        selectionLimit: 1,
      });

      console.log(result.assets[0]);

      const params = new SendBird.FileMessageParams();
      params.file = {
        size: result.assets[0].fileSize,
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: result.assets[0].type,
      };
      dispatch({type: 'start-loading'});
      channel.sendFileMessage(params, (message, err) => {
        dispatch({type: 'end-loading'});
        if (!err) {
          dispatch({type: 'send-message', payload: {message}});
        } else {
          setTimeout(() => {
            dispatch({
              type: 'error',
              payload: {error: 'Failed to send a message.'},
            });
          }, 500);
        }
      });
    } catch (err) {
      console.log(err);
      if (!DocumentPicker.isCancel(err)) {
        dispatch({type: 'error', payload: {error: err.message}});
      }
    }
  };

  const viewDetail = (message) => {
    if (message.isFileMessage()) {
      // TODO: show file details
    } else {
      console.log('Message Press');
    }
  };

  const showContextMenu = (message) => {
    if (message.sender && message.sender.userId === UserData.userId) {
      // message control
      // showActionSheetWithOptions(
      //   {
      //     title: 'Message control',
      //     message: 'You can edit or delete the message.',
      //     options: ['Edit', 'Delete', 'Cancel'],
      //     cancelButtonIndex: 2,
      //     destructiveButtonIndex: 1
      //   },
      //   buttonIndex => {
      //     switch (buttonIndex) {
      //       case 0: // edit
      //         break;
      //       case 1: // delete
      //         break;
      //       case 2: // cancel
      //         break;
      //     }
      //   }
      // );
    }
  };

  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const {StatusBarManager} = NativeModules;

  useEffect(() => {
    Platform.OS == 'ios'
      ? StatusBarManager.getHeight((statusBarFrameData) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />

      <SafeAreaView style={style.container}>
        {ProfileViewModal}

        <View style={style.BombView}>
          <Text style={style.BombText}>
            {/* 빠른 매칭을 위해 채팅은 10분으로 제한합니다. */}
          </Text>
        </View>

        <FlatList
          data={state.messages}
          inverted={true}
          renderItem={({item}) => (
            <Message
              key={item.reqId}
              channel={channel}
              message={item}
              SendBird={SendBird}
              onPress={(message) => viewDetail(message)}
              onPressImage={() => setProfileViewModalVis(!ProfileViewModalVis)}
              onLongPress={(message) => showContextMenu(message)}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => `${item.messageId}` || item.reqId}
          contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}
          ListHeaderComponent={
            state.error && (
              <View style={style.errorContainer}>
                <Text style={style.error}>{state.error}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <View style={style.emptyContainer}>
              <Text style={style.empty}>{state.empty}</Text>
            </View>
          }
          onEndReached={() => next()}
          onEndReachedThreshold={0.5}
        />
        <KeyboardAvoidingView
          style={style.inputContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            Platform.OS === 'ios'
              ? statusBarHeight + 50
              : -(statusBarHeight + 50)
          }>
          <TouchableOpacity
            activeOpacity={0.85}
            style={style.uploadButton}
            onPress={selectFile}>
            <Icon name="insert-photo" color="#7b53ef" size={28} />
          </TouchableOpacity>
          <TextInput
            value={state.input}
            style={style.input}
            multiline={true}
            numberOfLines={2}
            onChangeText={(content) => {
              // if (content.length > 0) {
              //   channel.startTyping();
              // } else {
              //   channel.endTyping();
              // }
              dispatch({type: 'typing', payload: {input: content}});
            }}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            style={style.sendButton}
            onPress={sendUserMessage}>
            <Icon
              name="send"
              color={state.input.length > 0 ? '#7b53ef' : '#ddd'}
              size={28}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const style = {
  container: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#37375B',
  },
  headerRightContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  headerRightButton: {
    // marginRight: 10,
    // backgroundColor: 'red',
  },
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
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    // width: '100%',
    fontSize: 20,
    color: '#555',
    height: 40,
  },
  uploadButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },

  BombView: [
    styles.ColumnCenter,
    {
      width: '100%',
      height: 122,
    },
  ],
  BombText: {
    fontSize: 12,
    color: '#DFE5F180',
  },
};

export default withAppContext(NoTimeLimiteChatScreen);
