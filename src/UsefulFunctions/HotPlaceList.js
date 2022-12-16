import {firebase} from '@react-native-firebase/database';

const reference = firebase
  .app()
  .database(
    'https://hunt-d7d89-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );

export const Get_itaewon_HotPlaceList = () => {
  const databaseDirectory = `/HotPlaceList/itaewon`;
  return reference
    .ref(databaseDirectory)
    .once('value')
    .then(snapshot => {
      let val = snapshot.val();
      const target = Object.values(val);
      return target;
    })
    .then(AllLocationData => {
      return AllLocationData;
    });
};
