import React, {useEffect, useState} from 'react';
import {Text, Image, TouchableOpacity, View, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';
import moment from 'moment';

import {withAppContext} from '../contextReducer';
import {Type3Rectangle} from './LinearGradient/LinearGradientCircle';
import LinearGradient from 'react-native-linear-gradient';
import {Type3} from './LinearGradient/LinearType';

const UserMessage = (props) => {
  const {
    SendBird,
    channel,
    message,
    onPress = () => {},
    onLongPress = () => {},
    navigation,
  } = props;
  // console.log('props In UserMessage:', props);
  const isMyMessage = message.sender.userId === SendBird.currentUser.userId;

  // console.log('channel In UserMessageComponent:', channel);
  // const [readReceipt, setReadReceipt] = useState(channel.members.length - 1);

  useEffect(() => {
    const channelHandler = new SendBird.ChannelHandler();
    // channelHandler.onReadReceiptUpdated = targetChannel => {
    //   if (targetChannel.url === channel.url) {
    //     setReadReceipt(channel.getUnreadMemberCount(message));
    //   }
    // };

    SendBird.addChannelHandler(`message-${message.reqId}`, channelHandler);
    // setReadReceipt(channel.getUnreadMemberCount(message));
    return () => {
      SendBird.removeChannelHandler(`message-${message.reqId}`);
    };
  }, []);

  const dstyle = (isMyMessage, customType) => {
    if (customType == 'L1') {
      StyleSheet.create({
        container: {
          backgroundColor: 'red',
        },
      });
    } else {
      if (isMyMessage) {
        StyleSheet.create({
          container: {
            backgroundColor: '#7b53ef',
          },
        });
      } else {
        StyleSheet.create({
          container: {
            backgroundColor: '#ddd',
          },
        });
      }
    }
  };

  // const bgP = (isMyMessage, customType) => {
  //   let bg = isMyMessage ? '#7b53ef' : '#ddd';
  //   if (customType == 'L1_Invite' || customType == 'L1_Res') {
  //     bg = 'red';
  //   }
  //   // bg = customType == 'L1_Invite' ? 'red' : bg;
  //   return bg;
  // };

  const Chat = (
    <View
      style={{
        ...style.content,
        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
      }}>
      {!message.hasSameSenderAbove && (
        <Text style={style.nickname}>{message.sender.nickname}</Text>
      )}
      <View
        style={{
          ...style.messageBubble,
          backgroundColor: isMyMessage ? '#7b53ef' : '#ddd',
        }}>
        <Text style={{...style.message, color: isMyMessage ? '#fff' : '#333'}}>
          {message.message}
        </Text>
      </View>
    </View>
  );

  const InviteChat = (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => {
        onPress(message);
      }}
      onLongPress={() => onLongPress(message)}
      style={{
        ...style.content,
        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
      }}>
      {!message.hasSameSenderAbove && (
        <Text style={style.nickname}>{message.sender.nickname}</Text>
      )}
      <LinearGradient
        colors={Type3}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={style.messageBubble}>
        <Text style={{...style.message, color: isMyMessage ? '#fff' : '#333'}}>
          {message.message}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        ...style.container,
        flexDirection: isMyMessage ? 'row-reverse' : 'row',
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProfileImageViewScreen', {
            UserEmail: message.sender.userId,
          });
        }}
        style={style.profileImageContainer}>
        {!message.hasSameSenderAbove && (
          <Image
            source={{uri: message.sender.profileUrl}}
            style={style.profileImage}
          />
        )}
      </TouchableOpacity>

      {message.customType == 'L1_Invite' || message.customType == 'L1_Res'
        ? InviteChat
        : Chat}

      <View
        style={{
          ...style.status,
          alignItems: isMyMessage ? 'flex-end' : 'flex-start',
        }}>
        {message.sendingStatus === 'pending' && (
          <Progress.Circle
            size={10}
            indeterminate={true}
            indeterminateAnimationDuration={800}
            color="#999"
          />
        )}
        {/* {message.sendingStatus === 'succeeded' && readReceipt > 0 && (
          <Text style={style.readReceipt}>{readReceipt}</Text>
        )} */}
        <Text style={style.updatedAt}>
          {moment(message.createdAt).fromNow()}
        </Text>
      </View>
    </View>
  );
};

const style = {
  container: {
    paddingHorizontal: 4,
    marginVertical: 2,
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderWidth: 0,
    borderRadius: 16,
    marginTop: 20,
  },
  content: {
    alignSelf: 'center',
    marginHorizontal: 4,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: 240,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 2,
  },
  message: {
    fontSize: 18,
  },
  status: {
    alignSelf: 'flex-end',
    marginHorizontal: 3,
    marginBottom: 3,
  },
  readReceipt: {
    fontSize: 12,
    color: '#f89',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
  },
};

export default withAppContext(UserMessage);
