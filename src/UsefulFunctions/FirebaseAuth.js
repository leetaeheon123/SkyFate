import auth from '@react-native-firebase/auth';

export function signIn({email, password}) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function signUp({email, password}) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

export function signOut() {
  return auth().signOut();
}

export async function WithdrawalInFbAuth() {
  if (auth().currentUser) {
    console.log(auth().currentUser);
    try {
      await auth().currentUser.delete();
      console.log('User deleted successfully');
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('No user is signed in');
  }
}
