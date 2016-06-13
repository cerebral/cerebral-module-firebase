import { getInstance } from './helpers';

export default function createTask(options) {
  return (name, payload = {}) => {
    return new Promise((resolve, reject) => {
      const firebase = getInstance();
      const tasksPath = options.queuePath || 'queue/tasks';
      const ref = firebase.database().ref(tasksPath);
      const taskKey = ref.push({
        ...payload,
        _state: name
      });

      const taskRef = firebase.database().ref(`${tasksPath}/${taskKey.key}`);
      taskRef.on('value', data => {
        if (!data.val()) {
          taskRef.off();
          resolve();
        }
        if (data.val() && data.val()._error_details) {
          reject(data.val()._error_details);
        }
      });
    });
  };
}
