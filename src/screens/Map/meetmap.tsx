import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Image

} from 'react-native'

import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import { MapScreenStyles } from '~/MapScreen';
import { reference } from './map';
const MeetMapScreen = ({route}:any) => {

  const {UserData, otherUserData} = route.params

  console.log("UserData:", UserData)
  console.log("otherUserData:", otherUserData)

  

  const Test = () => {
    const DBUrl = '/1v1meet/123uid'
    reference.ref(DBUrl).update({
      ManLang:origin,
      GirlLang:destination
    })
  }

  const origin = {latitude: 37.522623,
    longitude: 127.028021};
  const destination = {latitude: 37.522621,
    longitude: 127.026001};


  return (
    <View style={{width:'100%', height:'100%'}}>

      <MapView
          style={{width:'100%', height:'90%'}}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={false}
          loadingEnabled={true}
          userInterfaceStyle="light"
          // userInterfaceStyle="dark"
          minZoomLevel={5}
          maxZoomLevel={17}
          >
          <Marker
              coordinate={origin}
              tracksViewChanges={false}
            >
              <View>
                <Image 
                  source={{uri:UserData.ProfileImageUrl}}
                  style={MapScreenStyles.GirlsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>
            <Marker
              coordinate={destination}
              tracksViewChanges={false}
            >
              <View>
                <Image 
                  source={{uri:UserData.ProfileImageUrl}}
                  style={MapScreenStyles.GirlsMarker}
                  resizeMode="cover"
                />
              </View>
            </Marker>

  <Polyline
    coordinates={[origin, destination]}>

  </Polyline>

          </MapView>
          <Button title="Test" 
      onPress={()=>{
        Test()
      }}
      />
    </View>
  ) 

}

export default MeetMapScreen





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

