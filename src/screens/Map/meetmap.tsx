import React, {useEffect, useState, useReducer, useContext} from 'react';
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  NativeModules,
} from 'react-native';

import styles from '~/ManToManBoard';
import MapView, {Marker, Geojson} from 'react-native-maps';

import {MapScreenStyles} from '~/MapScreen';
import {GetMyCoords, reference} from './map';
import {chatReducer} from '../../reducer/chat';
import {AppContext} from '../../UsefulFunctions/Appcontext';
import Modal from 'react-native-modal';
import {ChatStyle} from '~/Chat';

import {selectFile, sendUserMessage} from '^/Chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Message from 'component/message';

import {viewDetail, showContextMenu} from '^/Chat';
import {locationReducer} from 'reducer/location';
import {ILocation} from './map';
import {UpdateMyLocationWatch} from './map';
import {ReplacedotInEmail} from '^/Replace';
import {parseLineString, tMapNavigate} from '../../utils';
import {L1ChatSvg} from 'component/Chat/ChatSvg';
import {L1styles} from '~/L1';
import LinearGradient from 'react-native-linear-gradient';
import {LinearProfileImagView} from 'component/General';
import {SecuritySvg} from 'component/General/GeneralSvg';
import firestore from '@react-native-firebase/firestore';

import {useKeyboard} from '@react-native-community/hooks';

const MeetMapScreen = ({route}: any, props: any) => {
  const {UserData, otherUserData, channel} = route.params;

  // console.log("UserData:", UserDatra)
  // console.log("otherUserData:", otherUserData)

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const uid = channel.url;

  const [Mylocation, locationdispatch] = useReducer(locationReducer, {
    latlng: {},
  });

  // console.log('Mylocation:', Mylocation);

  const [OtherLocation, setOtherLocation] = useState<ILocation | undefined>(
    undefined,
  );
  const [MyLocationState, setMyLocation] = useState<ILocation | undefined>(
    undefined,
  );

  let ReplaceUserEmail = ReplacedotInEmail(UserData.UserEmail);
  let ReplaceOtherUserEmail = ReplacedotInEmail(otherUserData.UserEmail);
  const MyDBUrlNode = `/1v1meet/${uid}/${ReplaceUserEmail}/Latlng`;
  const MyDBUrl = `/1v1meet/${uid}/${ReplaceUserEmail}`;

  const OtherDBUrl = `/1v1meet/${uid}/${ReplaceOtherUserEmail}`;

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

  const [geoJson, setGeoJson] = useState(null);

  // const [location, setLocation] = useState<ILocation | undefined>(undefined);

  useEffect(() => {
    StartLocation();
    console.log('============>');
    GetMyCoords(
      updateMatchLocation,
      '[GetMyCoords] Cannot get my location.',
      '[GetMyCoords] Successfully got my location.',
    );
    // locationdispatch({type: 'update', payload: {x:10} });
    // UpdateMyLocationWatch(setLocation, locationdispatch, UpdateMyLocation);

    UpdateMyLocationWatch(locationdispatch, UpdateMyLocation);

    SendBird.addChannelHandler('chat', channelHandler);
    // SendBird.addUserEventHandler('users', userEventHandler);

    if (!SendBird.currentUser) {
      SendBird.connect(UserData.userId, (_, err) => {
        if (!err) {
          console.log('refresj In UseEffect In MeetMap');
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

    const MyUpdate = reference.ref(MyDBUrl).on('child_changed', (snapshot) => {
      console.log('MyUpdate child_changed snapshot:', snapshot.val());
      setMyLocation(snapshot.val());
    });

    const OtherUpdate = reference
      .ref(OtherDBUrl)
      .on('child_changed', (snapshot) => {
        console.log('OtherUpdate child_changed snapshot:', snapshot.val());
        setOtherLocation(snapshot.val());
      });

    const MyStart = reference.ref(MyDBUrl).on('child_added', (snapshot) => {
      console.log('MyStart child_added snapshot:', snapshot.val());
      setMyLocation(snapshot.val());
    });

    const OtherStart = reference
      .ref(OtherDBUrl)
      .on('child_added', (snapshot) => {
        console.log('OtherStart child_added snapshot:', snapshot.val());
        setOtherLocation(snapshot.val());
      });

    return () => {
      reference.ref(MyDBUrl).off('child_changed', MyUpdate);
      reference.ref(OtherDBUrl).off('child_changed', OtherUpdate);
      reference.ref(MyDBUrl).off('child_added', MyStart);
      reference.ref(OtherDBUrl).off('child_added', OtherStart);

      // SendBird.removeConnectionHandler('chat');
      // SendBird.removeChannelHandler('chat');
      // unsubscribe.remove();
    };
  }, []);
  useEffect(() => {
    console.log('useEffect MyLo, OtherLo');
    drawRoute();
  }, [MyLocationState, OtherLocation]);

  const updateMatchLocation = (latitude: number, longitude: number) => {
    const channelUrl = channel.url;
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const matchedList = firestore().collection(
      `MatchedList/${now.getFullYear()}${month}/${date}`,
    );

    matchedList
      .doc(channelUrl)
      .update({
        [ReplaceUserEmail]: {
          latitude,
          longitude,
        },
      })
      .then(() => {
        console.log('[updatedMatchLocation] Location update succeed.');
      })
      .catch((err) => {
        console.error('[updatedMatchLocation] Location update failed:', err);
      });
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

  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

  // useEffect(() => {
  //   console.log('L1 Screen UseEffect [UserData]');
  //   console.log(Mylocation.latlng);
  // }, [props.route]);

  const StartLocation = () => {
    GetMyCoords(
      UpdateMyLocation,
      'Error In StartLocation Fun In L1Screen',
      'Sucees StartLocation Fun In L1 Screen',
    );
  };

  const UpdateMyLocation = (latitude: Number, longitude: Number) => {
    reference.ref(MyDBUrlNode).update({
      latitude: latitude,
      longitude: longitude,
    });
  };

  const UpdateSpicLocation = () => {
    reference.ref(MyDBUrlNode).update({
      latitude: 37.6041558,
      longitude: 126.9456834,
    });
  };

  const UpdateSpicLocation2 = () => {
    reference.ref(MyDBUrlNode).update({
      latitude: 37.6041558,
      longitude: 126.9056834,
    });
  };

  // const userEventHandler = new SendBird.UserEventHandler();

  // userEventHandler.onTotalUnreadMessageCountUpdated = (
  //   totalCount: any,
  //   countByCustomTypes: any,
  // ) => {
  //   console.log(
  //     'totalCount And countByCustomTypes:',
  //     totalCount,
  //     countByCustomTypes,
  //   );
  // };

  const channelHandler = new SendBird.ChannelHandler();
  channelHandler.onMessageReceived = (targetChannel: any, message: any) => {
    if (targetChannel.url === channel.url) {
      dispatch({type: 'receive-message', payload: {message, channel}});
    }
  };

  const ChatButton = () => {
    return (
      <View>
        <TouchableOpacity
          style={[MapScreenStyles.MyLocationBtn, styles.RowCenter]}
          onPress={() => {
            setChatModalVis(!ChatModalVis);
          }}>
          {L1ChatSvg}
          {/* <MaterialIcons name="message" size={27} color="#6713D2" /> */}
        </TouchableOpacity>
      </View>
    );
  };

  const [ChatModalVis, setChatModalVis] = useState(false);

  const drawRoute = async () => {
    if (OtherLocation == undefined || Mylocation == undefined) {
      console.log('OtherLocation:', OtherLocation);
      console.log('MyLocation:', MyLocationState);
      return;
    }
    const coordinates = {
      startX: MyLocationState?.longitude.toString(),
      startY: MyLocationState?.latitude.toString(),
      endX: OtherLocation?.longitude.toString(),
      endY: OtherLocation?.latitude.toString(),
    };
    console.log(coordinates);
    const data = await tMapNavigate(coordinates);
    data.features = parseLineString(data.features);
    console.log('features:', data.features);
    setGeoJson(data);
  };

  const Btn_Security = (
    <TouchableOpacity>{SecuritySvg(19, 23)}</TouchableOpacity>
  );

  // const keyboardDidShow = (e: any) => {
  //   console.log(e.endCoordinates.height);
  //   // keyboardHeight: e.endCoordinates.height,
  //   // normalHeight: Dimensions.get('window').height,
  //   // shortHeight: Dimensions.get('window').height - e.endCoordinates.height,
  // };

  // const keyboardDidShowListener = Keyboard.addListener(
  //   'keyboardDidShow',
  //   keyboardDidShow,
  // );

  const keyboard = useKeyboard();
  console.log('keyboard isKeyboardShow: ', keyboard.keyboardShown);
  console.log('keyboard keyboardHeight: ', keyboard.keyboardHeight);

  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const {StatusBarManager} = NativeModules;

  useEffect(() => {
    Platform.OS == 'ios'
      ? StatusBarManager.getHeight((statusBarFrameData: any) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const getKeyboardHeight = () => {
    if (keyboard.keyboardHeight == 0) {
      return 300;
    } else {
      return keyboard.keyboardHeight;
    }
  };

  console.log('statusBarHeight:', statusBarHeight);

  const ChatModal = (
    <Modal
      style={L1styles.ChatModal}
      isVisible={ChatModalVis}
      onBackdropPress={() => setChatModalVis(false)}
      // swipeDirection="down"
      // swipeThreshold={300}
      // onSwipeComplete={() => setChatModalVis(false)}
      coverScreen={false}>
      <View style={L1styles.Body}>
        <LinearGradient
          colors={['#7373F6', '#8B70F7', '#956EF6', '#A869F7']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={L1styles.Header}>
          {LinearProfileImagView(
            // '18.2%',
            // '82%',
            78,
            78,
            otherUserData.ProfileImageUrl,
            UserData.NickName,
          )}
          {/* 1/27 TODO: 신고부분 생성
          <View
            style={{
              position: 'absolute',
              right: 10,
              backgroundColor: 'red',
            }}>
            {Btn_Security}
          </View> */}
        </LinearGradient>
        <View style={L1styles.Main}>
          <View style={[styles.RowCenter, {marginTop: 10}]}>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 12,
                color: '#DFE5F1',
              }}>
              빠른 매칭을 위해 채팅은 15분으로 제한합니다.
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
                <View style={ChatStyle.errorContainer}>
                  <Text style={ChatStyle.error}>{state.error}</Text>
                </View>
              )
            }
            ListEmptyComponent={
              <View style={ChatStyle.emptyContainer}>
                <Text style={ChatStyle.empty}>{state.empty}</Text>
              </View>
            }
            onEndReached={() => next()}
            onEndReachedThreshold={0.5}
          />

          <KeyboardAvoidingView
            style={ChatStyle.inputContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={
              Platform.OS === 'ios'
                ? getKeyboardHeight()
                : -keyboard.keyboardHeight
            }
            // style={style.inputContainer}
            // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // keyboardVerticalOffset={
            //   Platform.OS === 'ios'
            //     ? statusBarHeight + 50
            //     : -(statusBarHeight + 50)
            // }
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={ChatStyle.uploadButton}
              onPress={() => selectFile(SendBird, dispatch, channel)}>
              <Icon name="insert-photo" color="#7b53ef" size={28} />
            </TouchableOpacity>
            <TextInput
              value={state.input}
              style={ChatStyle.input}
              multiline={true}
              numberOfLines={2}
              // placeholder="메세지를 입력하세요"
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
              style={ChatStyle.sendButton}
              onPress={() => {
                console.log(state.input);
                sendUserMessage(state.input, channel, dispatch, SendBird);
              }}>
              <Icon
                name="send"
                color={state.input.length > 0 ? '#7b53ef' : '#ddd'}
                size={28}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{width: '100%', height: '100%'}}>
      {ChatModal}
      {MyLocationState && (
        <MapView
          style={{width: '100%', height: '100%'}}
          initialRegion={{
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            latitude: MyLocationState.latitude,
            longitude: MyLocationState.longitude,
          }}
          showsUserLocation={false}
          loadingEnabled={true}
          // userInterfaceStyle="light"
          userInterfaceStyle="dark"
          minZoomLevel={5}
          maxZoomLevel={17}>
          {MyLocationState && (
            <Marker coordinate={MyLocationState} tracksViewChanges={false}>
              <View>
                <Image
                  source={{uri: UserData.ProfileImageUrl}}
                  style={MapScreenStyles.GirlsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>
          )}
          {OtherLocation && (
            <Marker coordinate={OtherLocation} tracksViewChanges={false}>
              <View>
                <Image
                  source={{uri: otherUserData.ProfileImageUrl}}
                  style={MapScreenStyles.GirlsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>
          )}
          {/*
          {OtherLocation && MyLocationState && (
            <Polyline coordinates={[MyLocationState, OtherLocation]}></Polyline>
          )} */}

          {geoJson && (
            <Geojson
              geojson={geoJson}
              strokeColor="#E219FC"
              // strokeColor="#FF03CD"
              // fillColor="green"
              strokeWidth={5}
            />
          )}
        </MapView>
      )}

      {/* <Button
        title="산으로이동"
        onPress={() => {
          UpdateSpicLocation();
          // drawRoute();
        }}
      />
      <Button
        title="집으로이동"
        onPress={() => {
          UpdateSpicLocation2();
        }}
      /> */}
      {ChatButton()}
    </View>
  );
};

export default MeetMapScreen;

// const GetMyPosition = async (EndLongitude, EndLatitude, GoToChat) => {
//   Geolocation.getCurrentPosition(
//     async position => {
//       const {latitude, longitude} = position.coords;
//       console.log(latitude, longitude);

//       const StartLatitude = latitude;
//       const StartLongitude = longitude;

//       const Distance = await GetDistanceBetweenTwoPoint(
//         StartLongitude,
//         StartLatitude,
//         EndLongitude,
//         EndLatitude,
//       );

//       const DistanceValue = Distance.distanceInfo.distance;
//       console.log(DistanceValue);

//       if (DistanceValue <= 100) {
//         GoToChat();
//       } else if (DistanceValue > 100) {
//         // GoToChat();
//         Alert.alert('100m 근방에 있어야 입장할 수 있습니다.');
//       }
//     },
//     error => {
//       // See error code charts below.
//       console.log(error.code, error.message);
//     },
//     {enableHighAccuracy: true, timeout: 300000, maximumAge: 10000},
//   );
// };

// const ReverseGeocoding = () => {
//   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=37.522621,
//   127.026001&key=${GOOGLE_MAPS_APIKEY}`)
//   .then(response => response.json())
//   .then(result => {
//     // console.log(result.results[0])
//     console.log(result.results[0].formatted_address)
// })

//   .catch(error => console.log('error', error));
// }

// const GOOGLE_MAPS_APIKEY = "AIzaSyB4tGCRQ3tKg3jvJ2mnG4OUxltghPldMcs"
