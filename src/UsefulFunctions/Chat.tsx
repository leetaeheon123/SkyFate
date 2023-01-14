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
import {GetEpochTime} from './GetTime';
import {MilisToMinutes} from './GetTime';

export const selectFile = async (
  SendBird: Object,
  dispatch: Function,
  channel: Object,
) => {
  try {
    if (Platform.OS === 'android') {
      const permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (permission !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
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

export const sendUserMessage = (
  Inputmessage: String,
  channel: Object,
  dispatch: Function,
  SendBird: Object,
) => {
  console.log(Inputmessage);
  if (Inputmessage.length > 0) {
    const params = new SendBird.UserMessageParams();
    params.message = Inputmessage;

    const pendingMessage = channel.sendUserMessage(
      params,
      (message: string, err: Error) => {
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
  }
};

export const showContextMenu = (message) => {
  console.log(message);
  // if (message.sender && message.sender.userId === UserData.userId) {
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
  // }
};

export const viewDetail = (message) => {
  if (message.isFileMessage()) {
    console.log('File');
    // TODO: show file details
  } else {
    // console.log(message)
  }
};
