import React, {useEffect, useContext, useReducer, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {ChatListStyles} from '~/ChatListStyles';
import Channel from 'component/channel';
import {AppContext} from '^/Appcontext';
import {channelsReducer} from 'reducer/channels';
import {GetEpochTime} from '^/GetTime';
import {Btn_ClickableBack, EmptyBox} from 'component/General';
import {Text_Message} from 'component/Chat/ChatSvg';
import styles from '~/ManToManBoard';
import {MainColor} from '~/Color/OneColor';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Get_UserListWantTalkMe} from 'Firebase/get';
import {useQuery} from 'react-query';
import {Create_RequestChating} from 'Firebase/create';
import {GotoChatScreen} from '^/SendBird';

const ChatListScreen = ({navigation, route}: any) => {
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  let {UserData} = route.params;
  // UserData = {...UserData, Uid: '44'};
  // console.log('UserData ChatList.tsx:', UserData);
  useEffect(() => {
    SendBird.addConnectionHandler('channels', connectionHandler);
    SendBird.addChannelHandler('channels', channelHandler);
    SendBird.addUserEventHandler('users', userEventHandler);

    if (!SendBird.currentUser) {
      // userId를 커낵트시킨 뒤
      SendBird.connect(UserData.UserEmail, (_: any, err: Error) => {
        if (!err) {
          // 에러가 없으면 리프레쉬부분을 실행
          refresh();
        } else {
          // 에러 발생시 리덕스를 통해 로딩 끝남을 알리고, 에러메세지를 보냄
          Alert.alert('Connection failed. Please check the network status.');
        }
      });
    } else {
      // console.log("SendBird.currentUser value In Map Screen UseEffect Function:", SendBird.currentUser)
      // 샌드버드에 등록된 유저값이 존재하면 리프래쉬!
      refresh();
    }

    return () => {
      SendBird.removeConnectionHandler('channels');
      SendBird.removeChannelHandler('channels');
    };
  }, []);

  // 나한테 채팅 요청 보낸 사람들을 가져오는

  const {data: UserListWantTalkMe, isLoading: UserListWantTalkMeisLoading} =
    useQuery('UserListWantTalkMekey', () =>
      Get_UserListWantTalkMe(UserData.Uid),
    );

  const [state, dispatch] = useReducer(channelsReducer, {
    SendBird,
    UserData,
    channels: [],
    channelMap: {},
    loading: false,
    empty: '',
    error: null,
  });

  const [query, setQuery] = useState(null);

  const next = () => {
    // query.hasNext가 존재할 때
    if (query.hasNext) {
      query.limit = 20;
      query.next((fetchedChannels: any, err: Error) => {
        // const distinctChannels = fetchedChannels.filter((data: any) => {
        //   let now = GetEpochTime();
        //   let milis = now - data?.createdAt;
        //   let second = Math.floor(milis / 1000);

        //   console.log('second In distn:', second);
        //   return second < 600 && data.name != '상담원';
        // });

        // console.log('distinctChannels:', distinctChannels);

        // console.log(
        //   "In Next Function query.next's callbackFunction's Return Value fectedChannels:,",
        //   fetchedChannels,
        // );
        if (!err) {
          dispatch({
            type: 'fetch-channels',
            // payload: {channels: distinctChannels},
            payload: {channels: fetchedChannels},
          });
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Failed to get the channels.',
            },
          });
        }
      });
    }
  };

  const refresh = () => {
    // state값에 sendbird.groupchannel. 그룹채널리스트 만들기 쿼리를 실행한 뒤 리턴값을 state에 저장
    setQuery(SendBird.GroupChannel.createMyGroupChannelListQuery());
    dispatch({type: 'refresh'});
  };

  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

  const chat = (channel: any) => {};

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
    dispatch({type: 'error', payload: {error: null}});
    refresh();

    //  handleNotificationAction(
    //    navigation,
    //    sendbird,
    //    currentUser,
    //    'channels',
    //  ).catch(err => console.error(err));
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
  channelHandler.onUserJoined = (channel, user) => {
    if (user.userId === SendBird.currentUser.userId) {
      dispatch({type: 'join-channel', payload: {channel}});
    }
  };
  channelHandler.onUserLeft = (channel, user) => {
    if (user.userId === SendBird.currentUser.userId) {
      dispatch({type: 'leave-channel', payload: {channel}});
    }
  };
  channelHandler.onChannelChanged = (channel) => {
    dispatch({type: 'update-channel', payload: {channel}});
    console.log('channelHandler.onChannelChanged');
  };
  channelHandler.onChannelDeleted = (channel) => {
    console.log('channel in channelHandler.onChannelDeleted:', channel);
    dispatch({type: 'delete-channel', payload: {channel}});
    navigation.navigate('IndicatorScreen', {
      action: 'deleteInServer',
      data: {channel},
    });
  };
  const userEventHandler = new SendBird.UserEventHandler();

  userEventHandler.onTotalUnreadMessageCountUpdated = (
    totalCount: any,
    countByCustomTypes: any,
  ) => {
    // console.log(
    //   'totalCount And countByCustomTypes:',
    //   totalCount,
    //   countByCustomTypes,
    // );
  };

  const Header = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {justifyContent: 'space-between', height: '10%'},
      ]}>
      <Btn_ClickableBack width={14} onPress={() => navigation.goBack()} />
      {Text_Message(66)}
      {EmptyBox}
    </View>
  );

  const WantMeUserList = (
    <TouchableOpacity
      onPress={() => {
        if (UserListWantTalkMeisLoading == false) {
          navigation.navigate('UserListWantTalkMeScreen', {
            UserData,
            UserListWantTalkMe,
          });
        }
      }}
      style={[
        styles.RowCenter,
        styles.DefaultBorder,
        {
          height: '10%',
          justifyContent: 'space-around',
          backgroundColor: '#E7F5F3',
          borderRadius: 8,
          borderColor: MainColor,
        },
      ]}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '800',
          color: MainColor,
        }}>
        나와 대화하고 싶어하는 회원들
      </Text>
      <MaterialIcons
        name="arrow-forward-ios"
        color={MainColor}
        size={25}></MaterialIcons>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={ChatListStyles.Body}>
      <View style={ChatListStyles.Main}>
        {Header}
        {WantMeUserList}

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
          }}
          onPress={() => {
            Create_RequestChating('DQfy02wCAdOG4yRRLheoW9DLHOw2', UserData);
          }}>
          <Text>샘플데이터 넣기</Text>
        </TouchableOpacity>

        <FlatList
          data={state.channels}
          renderItem={({item}) => (
            <Channel
              key={item.url}
              channel={item}
              sendbird={SendBird}
              onPress={(channel: any) => {
                GotoChatScreen(navigation, channel, UserData);
              }}
              viewtime={
                (channel: any) => {}
                // console.log('channelcreateAt:', channel.createdAt)
              }
              UserData={UserData}
            />
          )}
          keyExtractor={(item) => item.url}
          refreshControl={
            <RefreshControl
              refreshing={state.loading}
              colors={['#742ddd']}
              tintColor={'#742ddd'}
              onRefresh={refresh}
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={
            state.error && (
              <View style={ChatListStyles.errorContainer}>
                <Text style={ChatListStyles.error}>{state.error}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <View style={ChatListStyles.emptyContainer}>
              <Text style={ChatListStyles.empty}>
                {/* {state.empty} */}
                대화를 시작해보세요!
              </Text>
            </View>
          }
          onEndReached={() => next()}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatListScreen;
