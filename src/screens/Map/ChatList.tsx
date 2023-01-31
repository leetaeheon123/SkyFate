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
import {BombIconView, Btn_ClickableBack} from 'component/General';
import {
  BombIconSvg,
  ExplainLimit_BombSvg,
  Text_ExplainLimit_Main,
  Text_ExplainLimit_Sub,
  Text_Message,
} from 'component/Chat/ChatSvg';
import styles from '~/ManToManBoard';
const ChatListScreen = ({navigation, route}: any) => {
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const {UserData} = route.params;
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
    console.log('query.hasNext', query.hasNext);
    if (query.hasNext) {
      query.limit = 20;
      query.next((fetchedChannels: any, err: Error) => {
        console.log('fetchedChannels Type:', typeof fetchedChannels);
        console.log('fetchedChannels Length:', fetchedChannels.length);

        const distinctChannels = fetchedChannels.filter((data: any) => {
          let now = GetEpochTime();
          let milis = now - data?.createdAt;
          let second = Math.floor(milis / 1000);

          console.log('second In distn:', second);
          return second < 600;
        });

        console.log('distinctChannels:', distinctChannels);

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
    console.log(
      'createMyGroupChannelListQuery:',
      SendBird.GroupChannel.createMyGroupChannelListQuery(),
    );
    setQuery(SendBird.GroupChannel.createMyGroupChannelListQuery());
    dispatch({type: 'refresh'});
  };

  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

  const chat = (channel: any) => {
    navigation.navigate('ChatScreen', {
      channel,
      UserData,
    });
  };

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
    console.log(
      'totalCount And countByCustomTypes:',
      totalCount,
      countByCustomTypes,
    );
  };

  const Header = (
    <View
      style={[
        styles.Row_OnlyColumnCenter,
        {justifyContent: 'space-between', height: '10%'},
      ]}>
      <Btn_ClickableBack width={14} onPress={() => navigation.goBack()} />
      {Text_Message(66)}
      <Btn_ClickableBack width={14} onPress={() => navigation.goBack()} />
    </View>
  );

  return (
    <SafeAreaView style={ChatListStyles.Body}>
      <View style={ChatListStyles.Main}>
        {Header}
        <View style={ChatListStyles.Explain}>
          {ExplainLimit_BombSvg(90)}
          <Text style={{fontSize: 15, fontWeight: '400', color: 'white'}}>
            빠른매칭을 위해 채팅은 10분으로 제한합니다
          </Text>
          <View>
            <Text style={{fontSize: 12, fontWeight: '400', color: 'white'}}>
              채팅을 시작하는 순간 폭탄의 시간이 줄어듭니다
            </Text>
            <Text style={{fontSize: 12, fontWeight: '400', color: 'white'}}>
              총 10분이며, 1분씩 줄어드는 시스템입니다.
            </Text>
          </View>
        </View>

        <FlatList
          data={state.channels}
          renderItem={({item}) => (
            <Channel
              key={item.url}
              channel={item}
              sendbird={SendBird}
              onPress={(channel) => chat(channel)}
              viewtime={(channel) =>
                console.log('channelcreateAt:', channel.createdAt)
              }
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
              <Text style={ChatListStyles.empty}>{state.empty}</Text>
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
