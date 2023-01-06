// 자신의 위치를 트랙킹해서 맵에 보여주는 컴포넌트
const TrackUserLocation = () => {
  const [locations, setLocations] = useState < Array < ILocation >> [];
  let _watchId: number;

  //_watchId라는 값에 Geolocation.watchPostion의 반환값을 저장.
  // locations state가 변경될때마다 rendering -> 즉 위치변경때마다 화면렌더링을
  // 통해 마커로 지도 내 자신의 위치를 추적

  useEffect(() => {
    _watchId = Geolocation.watchPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setLocations([...locations, {latitude, longitude}]);
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 100,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  }, [locations]);

  // _watchId가 null이 아니면 clear..??
  // Watch에 대해 더 공부할 필요가 있다.

  useEffect(() => {
    GetLocationPermission();
    return () => {
      if (_watchId !== null) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      {locations.length > 0 && (
        <MapView
          // {Platform.OS === 'android' ? provider={PROVIDER_GOOGLE} : provider={default}}
          showsUserLocation
          // followsUserLocation
          loadingEnabled
          style={{flex: 1}}
          initialRegion={{
            // latitude: locations[0].latitude,
            // longitude: locations[0].longitude,
            latitude: 37.5226,
            longitude: 127.028,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {locations.map((location: ILocation, index: number) => (
            <Marker
              key={`location-${index}`}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 50,
                  backgroundColor: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{
                    uri: 'https://thumb.mt.co.kr/06/2021/04/2021042213221223956_1.jpg/dims/optimize/',
                  }}
                  style={{width: 30, height: 30, borderRadius: 35}}
                  resizeMode="cover"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

export default TrackUserLocation