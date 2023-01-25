import { makeStyles, createStyles } from "@mui/styles";
import React from "react";
import { memo, useCallback } from "react";
import { KEY_STORAGE_USER } from "../constants";
import useSessionStorage from "../hooks/useSessionStorage";
import { Messages } from "../view-models/message";
import { SetMessages } from "../view-models/set-message";
import Message from "./Message";

const useStyles = makeStyles(() =>
  createStyles({
    messagesBody: {
      overflowY: "auto",
      height: "100%",
      width: "100%",
      marginTop: "1rem",
    },
  })
);

interface MessageListProps {
  messages: Messages;
  setMessages: SetMessages;
  addedNewElement?: boolean;
}


/**
 * The component to render the message list
 * @param {Object} props the props object
 * @param {Array<Object>} props.messages messages to render
 * @param {VoidFunction} props.setMessages the function to set the messages in the store
 * @returns {React.ReactElement}
 */
function MessageListComponent({
    messages = [],
    setMessages = () => {},
    addedNewElement = false,
}: MessageListProps) {
  // It gets the user identifier
  const [userId] = useSessionStorage(KEY_STORAGE_USER);

  // It gets the style of the list message component
  const classes = useStyles();

  // Function to remove a message from the list
  const onRemove = useCallback((id: number, user: string) => {
    if (id && user) {
      const filteredMessage =
        messages
          ?.slice()
          .filter((message) => !(message.id === id && message.user === user)) ||
        [];
      setMessages([...filteredMessage]);
    }
  }, [messages, setMessages]);

  return (
    <div className={classes.messagesBody}>
      {messages?.map((message, index) => (
        <Message
          key={`${message.id}.${message.user}`}
          id={message.id}
          isRight={!(message.user === userId)}
          message={message.value}
          time={message.time}
          user={message.user}
          onRemove={onRemove}
          isLastElement={index === (messages.length - 1)}
          isNewElement={addedNewElement}
        />
      ))}
    </div>
  );
}

MessageListComponent.displayName = 'Message List component';

const MessageList = memo(MessageListComponent);

export default MessageList;
