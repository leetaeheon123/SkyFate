import React, {useEffect, useState} from 'react';
import {Text, Image, TouchableOpacity, View, Dimensions} from 'react-native';
import moment from 'moment';

import {withAppContext} from '../contextReducer';
import {
  createChannelName,
  createUnreadMessageCount,
  ellipsis,
} from '../utilsReducer';
import {GetEpochTime} from '^/GetTime';
import {BombIconView} from './General';
import {useInterval} from '../utils';

const LAST_MESSAGE_ELLIPSIS = 45;

const Channel = (props) => {
  const {sendbird, channel, onPress, viewtime, UserData} = props;

  const {width} = Dimensions.get('window');
  const [name, setName] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [unreadMessageCount, setUnreadMessageCount] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [CreatedAt, setCreatedAt] = useState('');

  const intervalRef = useInterval(() => {
    const minutes = getTimePassed();
    setCreatedAt(minutes);
    console.log('[channel.js] ChatRoom time passed:', minutes);
    if (minutes >= 10) {
      clearInterval(intervalRef.current);
    }
  }, 10000);

  useEffect(() => {
    const minutes = getTimePassed();

    // setCreatedAt(moment(channel.createdAt).fromNow());
    setCreatedAt(minutes);
  }, []);

  const getTimePassed = () => {
    const now = GetEpochTime();
    const milis = now - channel?.createdAt;
    const second = Math.floor(milis / 1000);
    const minutes = Math.floor(second / 60);

    return minutes;
  };

  const otherUserData = channel.members.filter(
    (data) => data.userId != UserData.UserEmail,
  );

  console.log('otherUserData In Channel.js :', otherUserData);

  const channelHandler = new sendbird.ChannelHandler();
  channelHandler.onChannelChanged = (updatedChannel) => {
    if (updatedChannel.url === channel.url) {
      updateChannelName(updatedChannel);
      updateLastMessage(updatedChannel);
      updateUnreadMessageCount(updatedChannel);
      updateUpdatedAt(updatedChannel);
    }
  };
  channelHandler.onUserJoined = (updatedChannel, user) => {
    if (updatedChannel.url === channel.url) {
      if (user.userId !== sendbird.currentUser.userId) {
        updateChannelName(updatedChannel);
      }
    }
  };
  channelHandler.onUserLeft = (updatedChannel, user) => {
    if (updatedChannel.url === channel.url) {
      if (user.userId !== sendbird.currentUser.userId) {
        updateChannelName(updatedChannel);
      }
    }
  };

  const updateChannelName = (channel) => {
    if (otherUserData) {
      setName(otherUserData[0].nickname);
    }
  };
  const updateLastMessage = (channel) => {
    if (channel.lastMessage) {
      const message = channel.lastMessage;
      if (message.isUserMessage()) {
        setLastMessage(message.message);
      } else if (message.isFileMessage()) {
        setLastMessage(message.name);
      }
    }
  };

  const updateUnreadMessageCount = (channel) => {
    setUnreadMessageCount(createUnreadMessageCount(channel));
  };

  const DecrementUnreadMessageCount = (channel) => {
    console.log('DecrementUnreadMessageCount');
    // channel.unreadMessageCount = 0;
    channel.markAsRead();
  };

  const updateUpdatedAt = (channel) => {
    setUpdatedAt(
      moment(
        channel.lastMessage ? channel.lastMessage.createdAt : channel.createdAt,
      ).fromNow(),
    );
  };

  useEffect(() => {
    // channel event listener
    sendbird.addChannelHandler(`channel_${channel.url}`, channelHandler);
    updateChannelName(channel);
    updateLastMessage(channel);
    updateUnreadMessageCount(channel);
    updateUpdatedAt(channel);
    return () => {
      sendbird.removeChannelHandler(`channel_${channel.url}`);
    };
  }, []);
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={style.container}
      onPress={() => {
        onPress(channel);
        viewtime(channel);
        DecrementUnreadMessageCount(channel);
      }}>
      <Image
        source={
          channel.coverUrl && otherUserData
            ? {uri: otherUserData[0].plainProfileUrl}
            : require('../Assets/logo-icon-purple.png')
        }
        style={style.profileImage}
      />
      <View style={style.contentContainer}>
        <Text style={style.name}>{name}</Text>
        <Text style={style.lastMessage}>
          {ellipsis(lastMessage.replace(/\n/g, ' '), LAST_MESSAGE_ELLIPSIS)}
        </Text>
      </View>
      <View style={style.propertyContainer}>
        <Text style={style.updatedAt}>{updatedAt}</Text>
        {channel.unreadMessageCount > 0 ? (
          <View style={style.unreadMessageCountContainer}>
            <Text style={style.unreadMessageCount}>{unreadMessageCount}</Text>
          </View>
        ) : null}
      </View>
      {BombIconView(width * 0.15, CreatedAt)}
    </TouchableOpacity>
  );
};

const style = {
  container: {
    flexDirection: 'row',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 17,
    marginTop: 18,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    marginRight: 15,
    // backgroundColor: '#fff',
    backgroundColor: '#D46060',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    alignSelf: 'center',
    paddingBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    // color: '#333',
    // color: 'black',
    marginBottom: 2,
    // color: 'white',
  },
  lastMessage: {
    fontSize: 15,
    fontWeight: '500',
    // color: '#999',
    color: '#8F8585',
  },
  propertyContainer: {
    alignItems: 'center',
  },
  unreadMessageCountContainer: {
    minWidth: 20,
    padding: 3,
    borderRadius: 10,
    backgroundColor: '#742ddd',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  unreadMessageCount: {
    fontSize: 12,
    color: '#fff',
  },
  updatedAt: {
    fontSize: 12,
    // color: '#999',
    color: '#888282',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
};

export default withAppContext(Channel);
