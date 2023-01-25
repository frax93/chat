import React, { useState } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import "./App.css";
import UsernameInsertModal from "./components/UsernameInsertModal";
import MessageList from "./components/MessageList";
import ChatBox from "./components/ChatBox";
import useLocalStorage from "./hooks/useLocalStorage";
import { KEY_STORAGE_MESSAGES } from "./env-constants";
import { Messages } from "./view-models/message";

const useStyles = makeStyles(() =>
  createStyles({
    pageBox: {
      height: "90vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
  })
);

/**
 * The component to render the app
 * @returns {React.ReactElement}
 */
function App() {
  // The state to control the modal to insert user identifier
  const [open, setOpen] = useState<boolean>(false);

  // The styles for the app component
  const classes = useStyles();

  // The storage hook to get the chat room messages
  const [messages, setMessages] = useLocalStorage<Messages>(KEY_STORAGE_MESSAGES);

  // The state to indicate that a new message has been added
  const [newMessageAdded, setNewMessageAdded] = useState<boolean>(false);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" data-testid="navbar-title">
            Chat Room
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className={classes.pageBox}>
        <MessageList
          messages={messages}
          setMessages={setMessages}
          addedNewElement={newMessageAdded}
        />
        <ChatBox
          messages={messages}
          setMessages={setMessages}
          setNewMessageAdded={setNewMessageAdded}
        />
      </Box>
      <UsernameInsertModal isVisible={open} handleVisibility={setOpen} />
    </div>
  );
}

export default App;
