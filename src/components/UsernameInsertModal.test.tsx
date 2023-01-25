import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import UsernameInsertModal from "components/UsernameInsertModal";
import { LocalStorageMock } from "mocks/localStorageMock";
import { SessionStorageMock } from "mocks/sessionStorageMock";

global.localStorage = new LocalStorageMock();
global.sessionStorage = new SessionStorageMock();

jest.mock('formik', () => {
    const formik = {
      handleSubmit: jest.fn(),
      setFieldValue: jest.fn(),
      setFieldError: jest.fn(),
      values: {
        username: '',
      },
      errors: {
        username: '',
      },
    };
    return {
      useFormik: () => formik,
    };
  });

const handleClose = jest.fn();

test("UsernameInsertModal", () => {
  const { getByTestId } = render(
    <UsernameInsertModal handleVisibility={handleClose} isVisible={true} />
  );

  const username = getByTestId("username");
  expect(username).toBeTruthy();

  const submitButton = getByTestId("begin");
  expect(submitButton).toBeTruthy();

  act(() => {
    fireEvent.change(username, { target: { value: "peter" } });
  });

  act(() => {
    fireEvent.click(submitButton);
  });

  expect(handleClose).toHaveBeenCalled();
});