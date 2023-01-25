import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { KEY_STORAGE_USER } from "./env-constants";

describe("App", () => {
  it("renders the Chat Room title", () => {
    render(<App />);
    const title = screen.getByTestId("navbar-title");
    expect(title).toBeInTheDocument();
  });

  it("renders the ChatBox and MessageList components", () => {
    render(<App />);
    const chatBox = screen.getByTestId("chat-box");
    expect(chatBox).toBeInTheDocument();
    const messageList = screen.getByTestId("messages");
    expect(messageList).toBeInTheDocument();
  });

  it("opens the username modal when no user is stored", () => {
    window.sessionStorage.removeItem(KEY_STORAGE_USER);
    render(<App />);
    const modal = screen.getByTestId("username-modal");
    expect(modal).toBeInTheDocument();
  });

  it("does not show the username modal if a username is stored in sessionStorage", () => {
    window.sessionStorage.setItem(
      KEY_STORAGE_USER,
      JSON.stringify("test-user")
    );
    render(<App />);
    expect(screen.queryByTestId("username-modal")).not.toBeInTheDocument();
  });

  it("closes the username modal after inserting a username", async () => {
    window.sessionStorage.removeItem(KEY_STORAGE_USER);
 
    render(<App />);

    const input = screen.getByTestId("username");

    const submitButton = screen.getByTestId("begin");

    fireEvent.change(input, { target: { value: "test-user" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      let modal;
      try {
        modal = screen.getAllByTestId("username-modal");
      } catch (error) {
        modal = null;
      }
      expect(modal).toBeNull();
    });
  });
});
