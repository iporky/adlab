import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, getByText, render, waitFor } from '@testing-library/react';

import DialogModal from '../../../src/commons/dialog';
import { DIALOG, dialogSlice, openDialog } from '../../../src/commons/dialog/dialogSlice';
import { apiSlice } from '../../../src/features/api/apiSlice';
// eslint-disable-next-line jest/no-mocks-import
import { setupApiStore } from '../../features/apis/__mocks__/mockStore';

const mockDialogContents = {
  title: 'Test Dialog',
  content: 'This is a test dialog.',
  footer: 'This is the footer.',
  showHeader: true,
  showFooter: true,
  showRejectionButton: true,
  rejectionButtonLabel: 'Close',
  onRejection: jest.fn(),
  rejectionButtonDisabled: false,
  showAffirmationButton: true,
  affirmationButtonLabel: 'Done',
  onAffirmation: jest.fn(),
  affirmationButtonDisabled: false,
};

describe('Dialog tests', () => {
  let storeRef;

  beforeAll(() => {
    storeRef = setupApiStore(apiSlice, {
      [DIALOG]: dialogSlice.reducer,
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  test('renders without crashing', async () => {
    await storeRef.store.dispatch(openDialog(mockDialogContents));
    const { queryByRole } = render(
      <Provider store={storeRef.store}>
        <DialogModal />
      </Provider>,
    );
    await waitFor(() => expect(queryByRole('dialog')).toBeDefined());
  });

  test('renders dialog contents correctly', async () => {
    await storeRef.store.dispatch(openDialog(mockDialogContents));
    const { queryByRole } = render(
      <Provider store={storeRef.store}>
        <DialogModal dialogContents={mockDialogContents} />
      </Provider>,
    );
    await waitFor(() => expect(queryByRole('dialog')).toBeDefined());
    const dialog = queryByRole('dialog');

    expect(getByText(dialog, mockDialogContents.title)).toBeDefined();
    expect(getByText(dialog, mockDialogContents.title)).toBeInTheDocument();
    expect(getByText(dialog, mockDialogContents.content)).toBeInTheDocument();
    expect(getByText(dialog, mockDialogContents.footer)).toBeInTheDocument();
  });

  test('calls onRejection and onAffirmation when buttons are clicked', async () => {
    await storeRef.store.dispatch(openDialog({ ...mockDialogContents, footer: undefined }));
    const { getByText } = render(
      <Provider store={storeRef.store}>
        <DialogModal />
      </Provider>,
    );

    await waitFor(() => getByText(mockDialogContents.affirmationButtonLabel));
    fireEvent.click(getByText(mockDialogContents.affirmationButtonLabel));
    expect(mockDialogContents.onAffirmation).toHaveBeenCalled();

    await waitFor(() => getByText(mockDialogContents.rejectionButtonLabel));
    fireEvent.click(getByText(mockDialogContents.rejectionButtonLabel));
    expect(mockDialogContents.onRejection).toHaveBeenCalled();
  });
});
