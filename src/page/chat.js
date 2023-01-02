import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useReducer,
  useContext,
} from 'react';
import {
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  View,
  FlatList,
  AppState,
  TextInput,
  Alert,
  Platform,
  Image,
  Dimensions,
  Modal,
  Button,
} from 'react-native';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {withAppContext} from '../contextReducer';
import {chatReducer} from '../reducer/chat';
import Message from '../component/message';
import {createChannelName} from '../utilsReducer';

import {AppContext} from '../UsefulFunctions/Appcontext';
import {GetTime} from '../../1108backup/src/UsefulFunctions/GetTime';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = (props) => {
  const {route, navigation} = props;

  const {channel} = route.params;
  const {UserData} = route.params;

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  // console.log('In Chat Page SendBird:', SendBird);
  // console.log('In Chat Page channel:', channel);

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

  const onoffReportModal = () => {
    setPortModalVisiable(!ReportModalVisiable);
  };

  const [ReportModalVisiable, setPortModalVisiable] = useState(false);
  const {height} = Dimensions.get('window');
  useLayoutEffect(() => {
    const right = (
      <View style={style.headerRightContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.headerRightButton}
          onPress={onoffReportModal}>
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={require('../Assets/security.png')}
          />
        </TouchableOpacity>
      </View>
    );

    navigation.setOptions({
      title: createChannelName(channel),
      headerRight: () => right,
    });
  });
  // on state change
  useEffect(() => {
    SendBird.addConnectionHandler('chat', connectionHandler);
    SendBird.addChannelHandler('chat', channelHandler);
    const unsubscribe = AppState.addEventListener('change', handleStateChange);

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
      unsubscribe.remove();
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
    if (user.userId === UserData.userId) {
      navigation.navigate('Lobby', {
        action: 'leave',
        data: {channel},
      });
    }
  };
  channelHandler.onChannelDeleted = (channelUrl, channelType) => {
    navigation.navigate('Lobby', {
      action: 'delete',
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
          navigation.navigate('Lobby', {
            action: 'leave',
            data: {channel},
          });
        },
      },
    ]);
  };
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

      // console.log('In SendUserMessaging Params:', params);

      // console.log('channel In sendUserMessage:', channel);

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
      const result = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
          DocumentPicker.types.plainText,
          DocumentPicker.types.zip,
        ],
      });

      const params = new SendBird.FileMessageParams();
      params.file = {
        size: result.size,
        uri: result.uri,
        name: result.name,
        type: result.type,
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

  const [SelectedId, setSelectedId] = useState(0);

  const ReturnTo = (message, id) => {
    return (
      <TouchableOpacity
        onPress={() => {
          ReportSelect(id);
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 10,

          backgroundColor: SelectedId == id ? 'skyblue' : null,
        }}>
        <Text>{message}</Text>
      </TouchableOpacity>
    );
  };

  const ReportSelect = (id) => {
    setSelectedId(id);
  };

  const ReportSubmit = async () => {
    onoffReportModal();
    const ReportId = await GetReportUid();
    await SaveReportInDB(ReportId);
    // Ban();
    setTimeout(() => {
      navigation.navigate('IndicatorScreen', {
        From: 'ChatScreen',
      });
    }, 2000);

    Alert.alert('신고 감사합니다. 조치할게요');
  };

  const GetReported = () => {
    const MemberList = [channel.members[0].userId, channel.members[1].userId];
    const ReportedList = MemberList.filter((data) => {
      return data != UserData.UserEmail;
    });

    const Reported = ReportedList[0];

    return Reported;
  };

  const Today = GetTime();
  const collection = firestore().collection(`Report/${Today}/ReportData`);

  const SaveReportInDB = async (ReportId) => {
    const MemberList = [channel.members[0].userId, channel.members[1].userId];

    const Reported = GetReported();

    collection.doc(String(ReportId)).set({
      Reporter: UserData.UserEmail,
      Reported: Reported,
      Members: MemberList,
      Cause: SelectedId,
      CreateAt: Date.now().toLocaleString(),
    });
  };

  const GetReportUid = async () => {
    let ReportId;
    await collection.get().then((querySnapshot) => {
      ReportId = querySnapshot.size;
    });

    return ReportId;
  };

  // const Ban = () => {
  //   const Reported = GetReported();
  //   console.log('Reported In Ban:', Reported);
  //   // const Reported = UserData.UserEmail;

  //   // console.log('channel.myRole', channel.myRole);
  //   // console.log('SendBird.Member Role ', SendBird.Member().Role);
  //   // if (channel.myRole === SendBird.Member.Role.OPERATOR) {
  //   // Ban a user.

  //   // channel.banUserWithUserId(Reported, 60, function (response, error) {
  //   //   if (error) {
  //   //     console.log('error:', error);
  //   //   }
  //   // });

  //   SendBird.GroupChannel.getChannel(
  //     'sendbird_group_channel_104563026_f3802fa5761bcc0a50172a96e1ac038c946c7ba5',
  //     function (groupChannel, error) {
  //       if (error) {
  //         // Handle error.
  //       }
  //       // Ban a user.
  //       groupChannel.banUser(
  //         Reported,
  //         -1,
  //         'DESCRIPTION',
  //         function (response, error) {
  //           if (error) {
  //             console.log('error:', error);
  //           }
  //         },
  //       );

  //       // Unban a user.
  //       // groupChannel.unbanUser(USER, function (response, error) {
  //       //   if (error) {
  //       //     // Handle error.
  //       //   }

  //       //   // The user is successfully unbanned for the channel.
  //       //   // You could notify the user of being unbanned by displaying a prompt.
  //       // });
  //     },
  //   );
  // };

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />

      <SafeAreaView style={style.container}>
        <Modal visible={ReportModalVisiable}>
          <View
            style={{
              width: '90%',
              height: height * 0.5,
              backgroundColor: 'red',
              marginLeft: '5%',
              marginTop: '30%',
            }}>
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={require('../Assets/security.png')}
            />
            <Button title="Close" onPress={onoffReportModal} />
            {ReturnTo('허위 프로필', 1)}
            {ReturnTo('욕설 및 비방', 2)}
            {ReturnTo('불쾌한 대화', 3)}
            {ReturnTo('나체 또는 성적인 컨텐츠', 4)}
            <Button title="Submit" onPress={ReportSubmit} />
          </View>
        </Modal>
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
              onLongPress={(message) => showContextMenu(message)}
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
        <View style={style.inputContainer}>
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
        </View>
      </SafeAreaView>
    </>
  );
};

const style = {
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightButton: {
    marginRight: 10,
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
    fontSize: 20,
    color: '#555',
  },
  uploadButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
};

export default withAppContext(ChatScreen);
