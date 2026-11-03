import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

import NotificationsBar from '../../../src/commons/notifications';
import {
  addNotification,
  NOTIFICATIONS,
  notificationsSlice,
} from '../../../src/commons/notifications/notificationSlice';
import { apiSlice } from '../../../src/features/api/apiSlice';
// eslint-disable-next-line jest/no-mocks-import
import { setupApiStore } from '../../features/apis/__mocks__/mockStore';

const mockNotifications = [
  {
    id: 1,
    title: 'Test Notification 1',
    message: 'This is a test notification.',
    intent: 'info',
    actions: [
      {
        label: 'Clear',
        onClick: jest.fn(),
      },
    ],
    persistent: false,
    clear: 5000,
  },
  {
    id: 2,
    title: 'Test Notification 2',
    message: 'This is another test notification.',
    intent: 'warning',
    actions: [],
    persistent: true,
  },
];

describe('NotificationsBar', () => {
  let storeRef;

  beforeEach(async () => {
    storeRef = setupApiStore(apiSlice, {
      [NOTIFICATIONS]: notificationsSlice.reducer,
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await storeRef.store.dispatch(addNotification(mockNotifications[0]));
    await storeRef.store.dispatch(addNotification(mockNotifications[1]));
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  it('renders without crashing', async () => {
    const { container } = render(
      <Provider store={storeRef.store}>
        <NotificationsBar />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders notifications correctly', async () => {
    const { getByText } = render(
      <Provider store={storeRef.store}>
        <NotificationsBar />
      </Provider>,
    );

    mockNotifications.forEach((notification) => {
      expect(getByText(notification.title)).toBeInTheDocument();
      expect(getByText(notification.message)).toBeInTheDocument();
    });
  });

  it('dispatches actions when an action button is clicked', async () => {
    const { getByRole } = render(
      <Provider store={storeRef.store}>
        <NotificationsBar />
      </Provider>,
    );

    const actionButton = getByRole('button', { name: 'Clear' });
    fireEvent.click(actionButton);
    expect(mockNotifications[0].actions[0].onClick).toHaveBeenCalled();
  });

  it(`dispatches removeNotification for all notifications when 'Clear All' button is clicked`, async () => {
    const { queryByText, getByText } = render(
      <Provider store={storeRef.store}>
        <NotificationsBar />
      </Provider>,
    );

    const clearAllButton = getByText('Clear all');
    fireEvent.click(clearAllButton);

    mockNotifications.forEach((notification) => {
      expect(queryByText(notification.title)).not.toBeInTheDocument();
      expect(queryByText(notification.message)).not.toBeInTheDocument();
    });
  });
});
