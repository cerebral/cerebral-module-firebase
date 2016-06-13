const listeners = {};
let instance;

export function setInstance(inst) {
  instance = inst;
}
export function getInstance() {
  return instance;
}

export function getFirebaseService(context) {
  const firebaseServicePath = context['cerebral-module-firebase'];
  return firebaseServicePath.reduce((services, key) => {
    return services[key];
  }, context.services);
}

export function createRef(path, options = {}) {
  const firebase = getInstance();
  return Object.keys(options).reduce((ref, key) => {
    if (key === 'payload') {
      return ref;
    }
    return ref[key](options[key]);
  }, firebase.database().ref(path));
}

export function listenTo(ref, path, event, signal, cb) {
  listeners[path] = listeners[path] || {};
  listeners[path][event] = listeners[path][event] || {};
  if (listeners[path][event][signal]) {
    listeners[path][event][signal].off();
  }
  listeners[path][event][signal] = ref;
  ref.on(event, cb);
}

export function stopListening(path, event, signal) {
  if (!event && !signal) {
    listeners[path].off();
    delete listeners[path];
  } else if (!signal) {
    listeners[path][event].off();
    delete listeners[path][event];
  } else {
    listeners[path][event][signal].off();
    delete listeners[path][event][signal];
  }
}
