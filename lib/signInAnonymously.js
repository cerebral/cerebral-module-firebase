import { getInstance } from './helpers';

export default function signInAnonymously() {
  return new Promise(function(resolve, reject) {
    function resolveUser(user) {
      resolve({
        user: {
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          providerData: user.providerData,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL
        }
      });
    }
    const firebase = getInstance();
    const unsubscribeInitialAuthChange = firebase.auth().onAuthStateChanged(user => {
      unsubscribeInitialAuthChange();
      if (user) {
        return resolveUser(user);
      }
      firebase.auth().signInAnonymously()
        .then(() => {
          const unsubscribeAuhtChange = firebase.auth().onAuthStateChanged(user => {
            unsubscribeAuhtChange();
            resolveUser(user);
          });
        })
        .catch(reject);
    });
  });
}
