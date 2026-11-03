import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';

import Prompt from '../../../src/commons/prompt';
import { PROMPT, promptSlice } from '../../../src/commons/prompt/promptSlice';
import { openPrompt } from '../../../src/commons/prompt/promptSlice';
import { apiSlice } from '../../../src/features/api/apiSlice';
// eslint-disable-next-line jest/no-mocks-import
import { setupApiStore } from '../../features/apis/__mocks__/mockStore';

const mockPromptContents = {
  title: 'Test Prompt',
  content: 'This is a test prompt.',
  actions: [
    {
      label: 'OK',
      appearance: 'primary',
      onClick: jest.fn(),
    },
  ],
  showRejectionButton: true,
  rejectionButtonLabel: 'Close',
  onRejection: jest.fn(),
  rejectionButtonDisabled: false,
};

describe('Prompt', () => {
  let storeRef;

  beforeAll(async () => {
    storeRef = setupApiStore(apiSlice, {
      [PROMPT]: promptSlice.reducer,
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await storeRef.store.dispatch(openPrompt(mockPromptContents));
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={storeRef.store}>
        <Prompt />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders prompt contents correctly', () => {
    const { getByText } = render(
      <Provider store={storeRef.store}>
        <Prompt />
      </Provider>,
    );

    expect(getByText(mockPromptContents.title)).toBeInTheDocument();
    expect(getByText(mockPromptContents.content)).toBeInTheDocument();
  });

  it('calls affirmation action when OK button is clicked', async () => {
    const { getByText, queryByRole } = render(
      <Provider store={storeRef.store}>
        <Prompt />
      </Provider>,
    );

    await waitFor(() => expect(queryByRole('dialog')).toBeDefined());

    fireEvent.click(getByText(mockPromptContents.actions[0].label));
    expect(mockPromptContents.actions[0].onClick).toHaveBeenCalled();
  });

  it('calls onRejection when dismiss button is clicked', () => {
    const { getByText } = render(
      <Provider store={storeRef.store}>
        <Prompt />
      </Provider>,
    );

    fireEvent.click(getByText(mockPromptContents.rejectionButtonLabel));
    expect(mockPromptContents.onRejection).toHaveBeenCalled();
  });
});
