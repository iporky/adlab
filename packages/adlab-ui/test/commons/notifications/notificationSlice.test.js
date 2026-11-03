import { messagesSelector, notificationsSlice } from '../../../src/commons/notifications/notificationSlice';

describe('notificationsSlice tests', () => {
  const { addNotification, removeNotification } = notificationsSlice.actions;
  const notificationReducer = notificationsSlice.reducer;
  const initialState = { order: [] };

  it('should handle initial state', () => {
    expect(notificationReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('addNotification action updates state correctly', () => {
    const payload = {
      title: 'Test Notification',
      message: 'This is a test notification.',
      intent: 'info',
      actions: [],
      persistent: false,
      clear: 5000,
    };
    const newState = notificationReducer(initialState, addNotification(payload));
    expect(newState.order.length).toEqual(1);
    expect(newState[newState.order[0]]).toEqual({ ...payload, id: 1 });
  });

  it('removeNotification action removes notification from state', () => {
    const stateWithNotification = notificationReducer(initialState, addNotification({ title: 'Test' }));
    const notificationId = stateWithNotification.order[0];
    const newState = notificationReducer(stateWithNotification, removeNotification(notificationId));
    expect(newState).toEqual(initialState);
  });

  it('messagesSelector selector returns correct part of state', () => {
    const state = {
      notifications: {
        order: [1],
        1: {
          id: 1,
          title: 'Test Notification',
          message: 'This is a test notification.',
        },
      },
    };
    const selectedState = messagesSelector(state);
    expect(selectedState).toEqual([state.notifications[1]]);
  });
});
