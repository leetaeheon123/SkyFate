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
import {CongratulateSvg} from 'component/Chat/ChatSvg';

const ChatScreen = (props) => {
  const {route, navigation} = props;

  const {channel} = route.params;
  const {UserData} = route.params;
  const {width} = Dimensions.get('window');

  const Key_MetaData = 'CanSendL1Invite_' + UserData.UserEmail;
  const keyboard = useKeyboard();

  const [chatMinutes, setChatMinutes] = useState('');

  // const GetMetadata = () => {
  //   var keys = [Key_MetaData];

  //   channel.getMetaData(keys, function (response, error) {
  //     if (error) {
  //       console.log(response);
  //     }
  //   });
  // };

  const [CanSendL1Invite, setCanSendL1Invite] = useState();

  channel.getMetaData([Key_MetaData], function (response, error) {
    if (!error) {
      let value = response[Key_MetaData];
      console.log('res:', value);
      setCanSendL1Invite(value);
    }
  });

  console.log('channel:', channel);

  // members 배열에서 UserEmail 값이 UserData.UserEmail과 동일한 요소를 제거함

  const otherUserData = channel.members.filter(
    (data) => data.userId != UserData.UserEmail,
  );

  // console.log(otherUserData[0].userId);
  // console.log(otherUserData[0].plainProfileUrl);

  // const otherUserDataObj = {
  //   UserEmail: otherUserData[0].userId,
  //   ProfileImageUrl: otherUserData[0].plainProfileUrl,
  // };
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  // console.log('In Chat Page SendBird:', SendBird);
  console.log('In Chat Page channel:', channel.members);

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
          style={[style.headerRightButton, {width: 25, height: 25}]}
          onPress={leave}>
          <Icon name="directions-walk" color="black" size={28} />
        </TouchableOpacity>
        {CanSendL1Invite == 0 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={style.headerRightButton}
            onPress={() => {
              sendL1InviteAndResUserMessage(
                'L1_Invite',
                `${UserData.NickName}님께서 둘만의 지도로 이동하자고 요청하셨습니다.`,
              );
            }}>
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={require('../Assets/Send.png')}
            />
          </TouchableOpacity>
        ) : null}

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

  const [InviteModalVis, setInviteModalVis] = useState(true);
  const [CongratulateModalVis, setCongratulateModalVis] = useState(false);

  const InviteModal = (
    <Modal isVisible={InviteModalVis}>
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
          요청을 수락하시겠습니까?
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '200',
            color: '#FFFFFF80',
            marginBottom: 15,
          }}>
          아니오를 누르시면 자동으로 취소됩니다.
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
              setInviteModalVis(false);
              setTimeout(() => {
                setCongratulateModalVis(true);
              }, 500);
              SendInviteResMessage();
            }}>
            <Text>네</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.RowCenter, styles.W50]}
            onPress={() => {
              setInviteModalVis(false);
            }}>
            <Text>아니요</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );

  const CongratulateModal = (
    <Modal isVisible={CongratulateModalVis}>
      <TouchableOpacity
        onPress={() => {
          setCongratulateModalVis(false);
        }}>
        {/* {CongratulateSvg(width * 0.9)}
         */}
        {CongratulateSvg(width * 0.9)}
      </TouchableOpacity>
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

  useEffect(() => {
    const minutes = getTimePassed();

    // setCreatedAt(moment(channel.createdAt).fromNow());
    setChatMinutes(minutes);
  }, []);

  const getTimePassed = () => {
    const now = GetEpochTime();
    const milis = now - channel?.createdAt;
    const second = Math.floor(milis / 1000);
    return Math.floor(second / 60);
  };

  const intervalRef = useInterval(() => {
    const minutes = getTimePassed();
    setChatMinutes(minutes);
    console.log('[chat.js] ChatRoom time passed:', minutes);
    if (minutes >= 10) {
      clearInterval(intervalRef.current);
    }
  }, 10000);

  const sendUserMessage = () => {
    if (state.input.length > 0) {
      const now = GetEpochTime();

      let milis = now - channel.createdAt;
      let second = Math.floor(milis / 1000);
      let minutes = MilisToMinutes(milis);

      if (second <= 600) {
        const params = new SendBird.UserMessageParams();
        params.message = state.input;

        const pendingMessage = channel.sendUserMessage(
          params,
          (message, err) => {
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
          },
        );
        dispatch({
          type: 'send-message',
          payload: {message: pendingMessage, clearInput: true},
        });
      } else if (second > 600) {
        Alert.alert('10분 초과하여서 나가집니다.');
        navigation.navigate('IndicatorScreen', {
          action: 'leave',
          data: {channel},
        });
      }
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

  const createMatch = () => {
    const channelUrl = channel.url;
    console.log('[chat.js] channel_url:', channelUrl);

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const matchedList = firestore().collection(
      `MatchedList/${now.getFullYear()}${month}/${date}`,
    );

    matchedList
      .doc(channelUrl)
      .set({createdAt: new Date()})
      .then(() => {
        console.log('[createMatch] Match created.');
      })
      .catch((err) => {
        console.error('[createMatch] error', err);
      });
  };

  const SendInviteResMessage = () => {
    sendL1InviteAndResUserMessage(
      'L1_Res',
      '둘 다 수락하여 방이 생성되었습니다! 메세지 클릭하면 둘만의 지도로 이동됩니다',
    );
    createMatch();
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
            channel: channel,
          });
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

  // const BombIcons = <View>{BombIconSvg}</View>;

  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const {StatusBarManager} = NativeModules;

  useEffect(() => {
    Platform.OS == 'ios'
      ? StatusBarManager.getHeight((statusBarFrameData) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const ReportModal = (
    <Modal visible={ReportModalVisiable} transparent={false}>
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
  );

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />

      <SafeAreaView style={style.container}>
        {ReportModal}
        {InviteModal}
        {CongratulateModal}

        <Modal visible={ReportModalVisiable} transparent={false}>
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
        <View style={style.BombView}>
          {BombIconViewNotabs(width * 0.2, chatMinutes)}

          <Text style={style.BombText}>
            빠른 매칭을 위해 채팅은 10분으로 제한합니다.
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

export default withAppContext(ChatScreen);
