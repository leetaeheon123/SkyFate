import React, {useEffect, useContext, useReducer, useState} from 'react';
import {Text, View, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import {ChatListStyles} from '~/ChatListStyles';
import Channel from 'component/channel';
import {AppContext} from '^/Appcontext';
import {channelsReducer} from 'reducer/channels';
import {Btn_ClickableBack, EmptyBox} from 'component/General';
import {Text_Message} from 'component/Chat/ChatSvg';
import styles from '~/ManToManBoard';
import {GetEpochTime} from '^/GetTime';
const FirstEventChatListScreen = ({navigation, route}: any) => {
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const {UserData} = route.params;
  useEffect(() => {
    SendBird.addConnectionHandler('channels', connectionHandler);
    SendBird.addChannelHandler('channels', channelHandler);
    SendBird.addUserEventHandler('users', userEventHandler);

    // console.log("SendBird.currentUser value In Map Screen UseEffect Function:", SendBird.currentUser)
    // 샌드버드에 등록된 유저값이 존재하면 리프래쉬!
    refresh();

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
    if (query.hasNext) {
      query.limit = 20;
      query.next((fetchedChannels: any, err: Error) => {
        const distinctChannels = fetchedChannels.filter((data: any) => {
          let memberLength = data.members.length;
          return memberLength >= 2 && data.name != '상담원';
        });

        if (!err) {
          dispatch({
            type: 'fetch-channels',
            payload: {channels: distinctChannels},
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
    setQuery(SendBird.GroupChannel.createMyGroupChannelListQuery());
    dispatch({type: 'refresh'});
  };

  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

  const chat = (channel: any) => {
    navigation.navigate('NoTimeLimitChatScreen', {
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
      {EmptyBox}
    </View>
  );

  return (
    <SafeAreaView style={ChatListStyles.Body}>
      <View style={ChatListStyles.Main}>
        {Header}

        <FlatList
          data={state.channels}
          renderItem={({item}) => (
            <Channel
              key={item.url}
              channel={item}
              sendbird={SendBird}
              onPress={(channel) => chat(channel)}
              viewtime={(channel) => {}}
              UserData={UserData}
              IsFirstEvent={true}
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

export default FirstEventChatListScreen;
