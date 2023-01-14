import React, {useEffect, useState, useReducer, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {locationReducer} from 'reducer/location';
import {ILocation} from './map';
import {UpdateMyLocationWatch} from './map';
import {ReplacedotInEmail} from '^/Replace';

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
  const [MyLocation, setMyLocation] = useState<ILocation | undefined>(
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

  // const [location, setLocation] = useState<ILocation | undefined>(undefined);

  useEffect(() => {
    // SendBird.addConnectionHandler('chat', connectionHandler);
    // SendBird.addChannelHandler('chat', channelHandler);
    // const unsubscribe = AppState.addEventListener('change', handleStateChange);

    StartLocation();

    // locationdispatch({type: 'update', payload: {x:10} });

    // UpdateMyLocationWatch(setLocation, locationdispatch, UpdateMyLocation);
    UpdateMyLocationWatch(locationdispatch, UpdateMyLocation);

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

  const ChatButton = () => {
    return (
      <View>
        <TouchableOpacity
          style={[MapScreenStyles.MyLocationBtn, styles.NoFlexDirectionCenter]}
          onPress={() => {
            setChatModal(!ChatModal);
          }}>
          <MaterialIcons name="message" size={27} color="#6713D2" />
        </TouchableOpacity>
      </View>
    );
  };

  const [ChatModal, setChatModal] = useState(true);

  return (
    <View style={{width: '100%', height: '100%'}}>
      <Modal
        style={{backgroundColor: 'red', width: '100%'}}
        isVisible={ChatModal}
        onBackdropPress={() => setChatModal(false)}
        swipeDirection="right"
        onSwipeComplete={() => setChatModal(false)}>
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
        <View style={ChatStyle.inputContainer}>
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
        </View>
      </Modal>
      {MyLocation && (
        <MapView
          style={{width: '100%', height: '90%'}}
          initialRegion={{
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            latitude: MyLocation.latitude,
            longitude: MyLocation.longitude,
          }}
          showsUserLocation={false}
          loadingEnabled={true}
          userInterfaceStyle="light"
          // userInterfaceStyle="dark"
          minZoomLevel={5}
          maxZoomLevel={17}>
          {MyLocation && (
            <Marker coordinate={MyLocation} tracksViewChanges={false}>
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
                  source={{uri: UserData.ProfileImageUrl}}
                  style={MapScreenStyles.GirlsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>
          )}

          {OtherLocation && MyLocation && (
            <Polyline coordinates={[MyLocation, OtherLocation]}></Polyline>
          )}
        </MapView>
      )}

      <Button
        title="Test"
        onPress={() => {
          UpdateSpicLocation();
        }}
      />
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
