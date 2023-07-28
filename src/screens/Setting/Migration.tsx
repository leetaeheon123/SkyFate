import React, {useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {
  Legacy_Get_AllUser,
  Legacy_Get_OneUser,
} from '../../Firebase/FbForMigration';
import {TouchableOpacity} from 'react-native-gesture-handler';
const MigrationScreen = () => {
  useEffect(() => {}, []);

  const OneUser = async () => {
    const LegacyUserList = await Legacy_Get_OneUser();
  };

  const AllUser = async () => {
    const LegacyUserList = await Legacy_Get_AllUser();
  };
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          width: 300,
          height: 300,
          backgroundColor: 'yellow',
        }}
        onPress={() => OneUser()}>
        <Text> OneUser</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 300,
          height: 300,
          marginTop: 50,
          backgroundColor: 'red',
        }}
        onPress={() => AllUser()}>
        <Text> AllUser</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export {MigrationScreen};
