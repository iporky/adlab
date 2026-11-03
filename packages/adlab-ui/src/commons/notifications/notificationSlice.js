import { createSelector, createSlice } from '@reduxjs/toolkit';

import constants from '../../lib/constants';

const { NOTIFICATIONS } = constants;
export { NOTIFICATIONS };

/**
 * The initial state of the notification slice.
 * Message structure,
 *     [id]: {
 *       id: 1,
 *       title: <div>Welcome to the TFS UI Components Next</div>,
 *       message: <div>This is a notification message</div>,
 *       intent: 'info | warning | error | success',
 *       actions: [
 *         {
 *           label: 'Action 1',
 *           onClick: () => {},
 *         },
 *         {
 *           label: 'Action 2',
 *           intent: 'secondary',
 *           onClick: () => {
 *             console.log('Action 2 clicked');
 *           },
 *         },
 *       ],
 *       persistent: false,
 *       clear: 5000,
 *     }
 */
const initialState = {
  /* Persists the insertion order of the messages */
  order: [],
};

export const notificationsSlice = createSlice({
  name: NOTIFICATIONS,
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const latestMessageId = state.order[state.order.length - 1];
      const messageId = (latestMessageId || 0) + 1;
      if (!state[messageId]) {
        state.order.push(messageId);
      }
      state[messageId] = { ...action.payload, id: messageId };
    },

    removeNotification: (state, action) => {
      if (state[action.payload]) {
        state.order.splice(state.order.indexOf(action.payload), 1);
        delete state[action.payload];
      }
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;

const notificationsSelector = (state) => state[NOTIFICATIONS];

export const messagesSelector = createSelector(notificationsSelector, (messages) =>
  messages?.order.map((messageId) => messages[messageId]),
);
