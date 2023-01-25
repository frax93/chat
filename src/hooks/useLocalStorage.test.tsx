import { fireEvent, render } from '@testing-library/react';
import { TestComponent } from 'fixture/test-component-local';
import React from 'react';

const logSpy = jest.spyOn(console, 'log');

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it('gets the initial value from localStorage', () => {
    const key = 'test-key';
    const initialValue = 'initial value';
    const { getByTestId } = render(<TestComponent keyValue={key} initialValue={initialValue} />);
    const button = getByTestId('get-button');
    fireEvent.click(button);
    expect(logSpy).toHaveBeenCalledWith(initialValue);
  });

  it('sets the value in localStorage', () => {
    const key = 'test-key';
    const initialValue = 'initial value';
    const { getByTestId } = render(<TestComponent keyValue={key} initialValue={initialValue} />);
    const button = getByTestId('set-button');
    fireEvent.click(button);
    expect(JSON.parse(window.localStorage.getItem(key) as string)).toBe('new value');
  });
});
