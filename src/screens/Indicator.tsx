import React, {useEffect} from 'react';
import {ActivityIndicator, SafeAreaView} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

async function _bootstrapAsync(navigation:any) {
  const userToken = await AsyncStorage.getItem('IdentityToken');

  // This will switch to the App screen or Auth screen and this loading
  // screen will be unmounted and thrown away.

  // 원래는 LoginScreen이 아니라 ValidInvitationCodeScreen
  navigation.navigate(userToken ? 'MapScreen' : 'ValidInvitationCodeScreen');
}

function IndicatorScreen() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      _bootstrapAsync(navigation);

      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  return (
    <SafeAreaView>
      <ActivityIndicator />
    </SafeAreaView>
  );
}

export default IndicatorScreen;
