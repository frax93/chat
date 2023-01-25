import React from "react";
import { render, screen } from "@testing-library/react";
import MessageList from "./MessageList";
import { SessionStorageMock } from "mocks/sessionStorageMock";

global.sessionStorage = new SessionStorageMock();

describe("MessageList", () => {
  const messages = [
    {
      id: 1,
      value: "Hello",
      time: "12:00",
      user: "user1",
    },
    {
      id: 2,
      value: "Hi",
      time: "12:01",
      user: "user2",
    },
  ];

  const setMessages = jest.fn();

  it("should render a list of messages", () => {
    render(<MessageList messages={messages} setMessages={setMessages} />);

    // Make sure the correct number of messages are displayed
    expect(screen.getAllByTestId("message").length).toEqual(messages.length);

    // Check that the message content is correct
    messages.forEach((message) => {
      expect(
        screen.getByTestId(`message-content-${message.id}`).textContent
      ).toEqual(message.value);
    });
  });
});
