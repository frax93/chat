import React, { memo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import useLocalStorage from "../hooks/useLocalStorage";
import useSessionStorage from "../hooks/useSessionStorage";
import { KEY_STORAGE_USER, KEY_STORAGE_USERS } from "../env-constants";
import { Users } from "../view-models/user";

const validationSchema = Object.freeze(yup.object({}).shape({
  username: yup.string().required("Field required"),
}));

interface UsernameInsertModalProps {
  handleVisibility: (isVisible: boolean) => void;
  isVisible: boolean;
}

interface InsertModalForm {
  username: string;
}


/**
 * The modal component to insert the user
 * @param {Object} props the props object 
 * @param {boolean} props.isVisible the modal is visible
 * @param {Function} props.handleVisibility the function to control the open/close of the modal
 * @returns {React.ReactElement}
 */
function UsernameInsertModalComponent({
    handleVisibility,
    isVisible
}: UsernameInsertModalProps) {
    // The list of the user connected to the app
  const [usersConnected, setUsersConnected] = useLocalStorage<Users>(
    KEY_STORAGE_USERS,
    []
  );

  // The storage identifier of the user
  const [userId, setUser] = useSessionStorage<string>(KEY_STORAGE_USER);

 // Handle close function to close the modal
  const handleClose = useCallback(() => {
    handleVisibility(false);
  }, [handleVisibility]);

  // Handle function for the submit on enter of the username
  const handleInsertUsername = useCallback(
    (
      values: InsertModalForm,
      formikContext: FormikHelpers<InsertModalForm>
    ) => {
      const users = usersConnected.slice();

      const userFound = users.find((user) => user === values.username);

      // if user is registered yet, then error otherwise insert of it
      if (!userFound) {
        users.push(values.username);
        setUsersConnected(users);
        setUser(values.username);
      } else {
        formikContext.setFieldError(
          "username",
          "The username has been chosen yet, try another"
        );
        return;
      }

      // Reset the form
      formikContext.resetForm();

      // Close the modal
      handleClose();
    },
    [usersConnected, handleClose, setUsersConnected, setUser]
  );

  // The form of the modal
  const modalForm = useFormik<InsertModalForm>({
    initialValues: {
      username: "",
    },
    // The username is required
    validationSchema,
    onSubmit: handleInsertUsername,
  });

  // Use uffect to check if the user has a username or not
  useEffect(() => {
    if (!userId) {
      handleVisibility(true);
    }
  }, [userId, handleVisibility]);

  return isVisible ? (
    <Dialog open={isVisible} onClose={handleClose} data-testid="username-modal">
      <DialogTitle>Chat Room</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Insert your username to begin to chat!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          aria-label="Username"
          type="text"
          value={modalForm.values.username || ""}
          fullWidth
          onChange={(event) => {
            modalForm.setFieldValue("username", event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              modalForm.handleSubmit();
            }
          }}
          inputProps={{
            'data-testid': 'username'
          }}
          variant="standard"
          error={!!modalForm.errors.username && modalForm.touched.username}
          helperText={modalForm.errors.username || ""}
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            modalForm.handleSubmit();
          }}
          data-testid="begin"
        >
          Begin
        </Button>
      </DialogActions>
    </Dialog>
  ) : <></>;
}

UsernameInsertModalComponent.displayName = 'The modal to insert the user identifier';

const UsernameInsertModal = memo(UsernameInsertModalComponent);

export default UsernameInsertModal;
