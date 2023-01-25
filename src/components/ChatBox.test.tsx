import { waitFor, render, fireEvent } from "@testing-library/react";
import React from "react";
import { Messages } from "view-models/message";
import ChatBoxComponent from "./ChatBox";
import * as useSessionStorageMock from '../hooks/useSessionStorage';

const spy = jest.spyOn(useSessionStorageMock, 'default');


describe("ChatBoxComponent", () => {
  afterAll(() => {
    spy.mockRestore();
  })
  it("submits a message", async () => {
    const messages: Messages = [];

    const setMessages = jest.fn();

    const setNewMessageAdded = jest.fn();

    spy
      .mockReturnValue(["user1", jest.fn()]);

    const wrapper = render(
      <ChatBoxComponent
        messages={messages}
        setMessages={setMessages}
        setNewMessageAdded={setNewMessageAdded}
      />
    );
    // Find the message input field and enter a message
    const messageInput = wrapper.getByTestId('message');

    fireEvent.change(messageInput, { target: { value: "Hello, world!" } });

    // Simulate the onSubmit of the form
    const form =  wrapper.getByTestId('form');

    fireEvent.submit(form);
    
    await waitFor(() => {
      // Check that the setMessages function was called with the new message
      expect(setMessages).toHaveBeenCalledWith([
        {
          id: 1,
          user: "user1",
          value: "Hello, world!",
          time: expect.any(String),
        },
      ]);
      // Check that the setNewMessageAdded function was called with true
      expect(setNewMessageAdded).toHaveBeenCalledWith(true);
    });
  });
});
