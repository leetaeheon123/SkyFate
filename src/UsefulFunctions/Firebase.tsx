import firestore from '@react-native-firebase/firestore';

export const DeleteInFbFirestore = async (
  CollectionPath: string,
  DocPath: string,
) => {
  firestore()
    .collection(`${CollectionPath}`)
    .doc(`${DocPath}`)
    .delete()
    .then(() => {
      console.log('Success DeleteInFbFirestore');
    });
};
