import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({
  Cconversation: null,
  location: null,
  Online: null,
  Notification: null,
  UnReadnotification: null,
  Arrivalnotification: null,
  UnreadMessages: null,
});

export { useGlobalState };
