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
  Dimensions,
  AppState,
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

import {AppContext} from '../UsefulFunctions/Appcontext';

import {GetEpochTime, MilisToMinutes} from '^/GetTime';
import styles from '~/ManToManBoard';

import {ChatLeaveSvg} from 'component/Chat/ChatSvg';
import {UpdateFbFirestore} from '^/Firebase';

import {launchImageLibrary} from 'react-native-image-picker';

const CsChatScreen = (props) => {
  const {route, navigation} = props;

  const {channel} = route.params;
  const {UserData} = route.params;
  const {width} = Dimensions.get('window');

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
  const {height} = Dimensions.get('window');
  useLayoutEffect(() => {
    const right = (
      <View style={style.headerRightContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.headerRightButton}
          onPress={leave}>
          {ChatLeaveSvg}
        </TouchableOpacity>
      </View>
    );

    navigation.setOptions({
      title: '상담원',
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

    if (!SendBird.currentUser) {
      SendBird.connect(UserData.userId, (_, err) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Connection failed. Please check the network status.',
            },
          });
        }
      });
    } else {
      refresh();
    }

    return () => {
      SendBird.removeConnectionHandler('chat');
      SendBird.removeChannelHandler('chat');
    };
  }, []);

  /// on query refresh
  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

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

  const refresh = () => {
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
      if (message.customType == 'L1_Invite') {
        let now = Date.now();
        let milis = now - message.createdAt;
        let second = Math.floor(milis / 1000);

        if (second <= 60) {
          // Alert.alert('Gogo?');
          if (message.sender.userId != UserData.UserEmail) {
            setInviteModalVis(true);
          } else {
            Alert.alert('자기가 누르는건 에바지');
          }
        } else {
          Alert.alert('60초 초과');
        }
      } else if (message.customType == 'L1_Res') {
        if (otherUserData.length == 0) {
          Alert.alert('상대방이 방을 나가셨습니다.');
        } else {
          navigation.navigate('MeetMapScreen', {
            UserData: UserData,
            // otherUserData: otherUserDataObj,
            otherUserData: {
              UserEmail: otherUserData[0].userId,
              ProfileImageUrl: otherUserData[0].plainProfileUrl,
            },
            channel: {
              url: channel.url,
              createdAt: channel.createdAt,
            },
          });
          UpdateFbFirestore('UserList', UserData.UserEmail, 'otherUserData', {
            UserEmail: otherUserData[0].userId,
            ProfileImageUrl: otherUserData[0].plainProfileUrl,
          });
          UpdateFbFirestore('UserList', UserData.UserEmail, 'channel', {
            url: channel.url,
            createdAt: channel.createdAt,
          });
          UpdateFbFirestore(
            'UserList',
            UserData.UserEmail,
            'L1CreatedAt',
            channel.createdAt,
          );
        }
      } else {
        console.log('viewDetail message in chat,js:', message);
      }
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
          // contentContainerStyle={[
          //   style.inputContainer,
          //   {marginBottom: 47 + 44},
          // ]}
          // keyboardVerticalOffset={
          //   Platform.OS === 'ios'
          //     ? keyboard.keyboardHeight * 0.45
          //     : // : -keyboard.keyboardHeight * 0.45
          //       null
          // }
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

export default withAppContext(CsChatScreen);
