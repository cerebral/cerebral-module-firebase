import firebase from 'firebase';
import {
  setInstance,
  stopListening,
  getFirebaseService
} from './helpers';
import signInAnonymouslyService from './signInAnonymously';
import createOnChildAdded from './createOnChildAdded';
import createOnChildRemoved from './createOnChildRemoved';
import createOnChildChanged from './createOnChildChanged';
import createOnValue from './createOnValue';
import createTask from './createTask';
import value from './value';
import values from './values';

export function signInAnonymously(context) {
  const firebaseService = getFirebaseService(context);
  firebaseService.signInAnonymously()
    .then(context.output.success)
    .catch(context.output.error);
}
signInAnonymously.async = true;

export default (options = { payload: {} }) => (module, controller) => {
  controller.addContextProvider({
    'cerebral-module-firebase': module.path
  });
  const instance = firebase.initializeApp(options.config, options.name);
  setInstance(instance);

  module.addServices({
    getFirebase: (service) => {
      if (service) {
        return instance[service]();
      }
      return instance;
    },
    signInAnonymously: signInAnonymouslyService,
    off: stopListening,
    onChildAdded: createOnChildAdded(controller),
    onChildRemoved: createOnChildRemoved(controller),
    onChildChanged: createOnChildChanged(controller),
    onValue: createOnValue(controller),
    value,
    values,
    task: createTask(options)
  });
};
