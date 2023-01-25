import { fireEvent, render } from '@testing-library/react';
import { TestComponent } from 'fixture/test-component-session';
import React from 'react';

const logSpy = jest.spyOn(console, 'log');

describe('useSessionStorage', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    window.sessionStorage.clear();
  });

  it('gets the initial value from sessionStorage', () => {
    const key = 'test-key';
    const initialValue = 'initial value';
    const { getByTestId } = render(<TestComponent keyValue={key} initialValue={initialValue} />);
    const button = getByTestId('get-button');
    fireEvent.click(button);
    expect(logSpy).toHaveBeenCalledWith(initialValue);
  });

  it('sets the value in sessionStorage', () => {
    const key = 'test-key';
    const initialValue = 'initial value';
    const { getByTestId } = render(<TestComponent keyValue={key} initialValue={initialValue} />);
    const button = getByTestId('set-button');
    fireEvent.click(button);
    expect(JSON.parse(window.sessionStorage.getItem(key) as string)).toBe('new value');
  });
});
