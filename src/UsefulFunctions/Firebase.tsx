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

export const UpdateFbFirestore = async (
  CollectionPath: string,
  DocPath: string,
  Data: string,
  value: string,
) => {
  firestore()
    .collection(`${CollectionPath}`)
    .doc(`${DocPath}`)
    .update({
      [Data]: value,
    })
    .then(() => {
      console.log('Success DeleteInFbFirestore');
    });
};
