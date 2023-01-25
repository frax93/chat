import React, { memo, useCallback } from "react";
import { TextField, Grid, Typography } from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import useSessionStorage from "../hooks/useSessionStorage";
import { DateTime } from "luxon";
import { KEY_STORAGE_LAST_MESSAGE, KEY_STORAGE_USER } from "../constants";
import { Message, Messages } from "../view-models/message";
import { SetMessages } from "../view-models/set-message";

const regexMessage = /^[A-Za-z0-9]+[\s]*$/ig;

const validationSchema = Object.freeze(yup.object({}).shape({
  message: yup.string().required("Field required").matches(regexMessage, 'Invalid format'),
}));


interface ChatForm {
  message: string;
  storageMessageId: Message["id"] | null;
}

interface ChatBoxProps {
  messages: Messages;
  setMessages: SetMessages;
  setNewMessageAdded: (isAdded: boolean) => void;
}

/**
 * The component to render the chat box component
 * @param {Object} props the props object
 * @param {Messages} props.messages messages to render
 * @param {VoidFunction} props.setMessages the function to set the messages in the store
 * @returns {React.ReactElement}
 */
function ChatBoxComponent({
  messages = [],
  setMessages = () => {},
  setNewMessageAdded = () => {},
}: ChatBoxProps) {
  // It gets the the user identifier
  const [userId] = useSessionStorage<string>(KEY_STORAGE_USER);

  // It gets the the last message of the current user
  const [lastMessageUser, setLastMessageUser] = useSessionStorage<Message>(
    KEY_STORAGE_LAST_MESSAGE
  );

  const handleSubmitChat = useCallback(
    (values: ChatForm, formikContext: FormikHelpers<ChatForm>) => {
      const messagesSliced = messages?.slice() || [];

      // Filter the current user messages
      const lastMessages: Messages =
        messagesSliced.slice().filter((message) => message.user === userId) ||
        [];

      // Reverse the list to put in first position the last one
      const lastMessageReversed = lastMessages.reverse();

      // Get the first (last message) of the list reversed
      const [lastMessage] = lastMessageReversed;

      let newMessages: Messages = [];

      // If has been pressed the storage arrow up and want to modify that element
      if (values.storageMessageId) {
        newMessages = messagesSliced.filter(
          (message) => !(message.id === values.storageMessageId)
        );

        // It's a new insert element
        const newMessage: Message = {
          id: lastMessage ? lastMessage.id + 1 : 1,
          user: userId,
          value: values.message,
          time: DateTime.now().toFormat("HH:mm"),
        };

        newMessages = [...newMessages, newMessage];

        // Setting new last message for the current user
        setLastMessageUser(newMessage);
      } else {
        // It's a new insert element
        const newMessage: Message = {
          id: lastMessage ? lastMessage.id + 1 : 1,
          user: userId,
          value: values.message,
          time: DateTime.now().toFormat("HH:mm"),
        };

        newMessages = [...messagesSliced, newMessage];

        // Setting new last message for the current user
        setLastMessageUser(newMessage);
      }

      setNewMessageAdded(true);

      // Setting new messages
      setMessages(newMessages);

      setTimeout(() => {
        setNewMessageAdded(false);
      }, 1000);

      // Resetting the form
      formikContext.resetForm();
    },
    [messages, setLastMessageUser, setMessages, setNewMessageAdded, userId]
  );

  // The formik form to control the submit of the current user message
  const chatForm = useFormik<ChatForm>({
    initialValues: {
      message: "", // The current message
      storageMessageId: null, // The id of the last message if is the case
    },
    // It's needed a message to do enter
    validationSchema,
    onSubmit: handleSubmitChat,
  });

  return (
    <div>
      <form onSubmit={chatForm.handleSubmit}>
        <Grid container spacing={1} display="flex" alignItems="center">
          <Grid item xs={12} md={1}>
            <Typography>{userId}</Typography>
          </Grid>
          <Grid item xs={12} md={10}>
            <TextField
              id="message"
              arie-label="Enter text"
              type="text"
              placeholder="Enter message text"
              fullWidth
              value={chatForm.values.message || ""}
              onChange={(event) => {
                chatForm.setValues({
                  message: event.target.value,
                  storageMessageId: null,
                });
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  chatForm.setValues({
                    message: lastMessageUser.value,
                    storageMessageId: lastMessageUser.id,
                  });
                  return;
                }
              }}
              variant="standard"
              error={!!chatForm.errors.message && chatForm.touched.message}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

ChatBoxComponent.displayName = "Chat box component";

const ChatBox = memo(ChatBoxComponent);

export default ChatBox;
