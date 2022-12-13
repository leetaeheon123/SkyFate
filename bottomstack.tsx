import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapScreen from './src/screens/map';
import TwoMapScreen from './src/screens/twomap';

import {RootStackParamList} from './src/screens/RootStackParamList';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createMaterialBottomTabNavigator();

const BottomTabScreen = () => {
  // 성별 가져오는 코드 필요합니다 - 2022 10 09 오후1시.

    return (
      <BottomTab.Navigator>

        <BottomTab.Screen
          name="MapScreen"
          component={MapScreen}
        />
         <BottomTab.Screen
          name="TwoMapScreen"
          component={TwoMapScreen}
        />
       
      </BottomTab.Navigator>

    );
};

export default BottomTabScreen;
