import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import MessageComponent from "./Message";

describe("MessageComponent", () => {
  it("should only show the delete icon on hover and remove the element", async () => {
    const onRemove = jest.fn();

    const { getByTestId, getByText } = render(
      <MessageComponent
        id={1}
        message="Hello, world!"
        time="12:00"
        user="user-1"
        onRemove={onRemove}
      />
    );

    // Check that the message is displayed
    expect(getByText('Hello, world!')).toBeDefined();

    const hoverElement = getByTestId("message-hover-1");

    let deleteIconElement = null;

    try {
      deleteIconElement = getByTestId("remove-icon");
    } catch (error) {
      deleteIconElement = null;
    }

    // Initially, the delete icon should not be displayed
    expect(deleteIconElement).toBeNull();

    // Simulate hover event on the message element
    fireEvent.mouseOver(hoverElement);

    await waitFor(() => {
      const deleteAfterHoverIcon = getByTestId("remove-icon");

      // The delete icon should now be displayed
      expect(deleteAfterHoverIcon).toBeDefined();

      fireEvent.click(deleteAfterHoverIcon);

      expect(onRemove).toHaveBeenCalledWith(1, "user-1");
    });
  });
});
