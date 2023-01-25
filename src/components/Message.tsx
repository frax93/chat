import React, { memo, useCallback, useState } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface StyleProps {
  isNewElement: boolean;
  isLastElement: boolean;
}

const useStyles = ({ isNewElement, isLastElement }: StyleProps) =>
  makeStyles(() => {
    return createStyles({
      messageRow: {
        display: "flex",
        transition: 'color 2s ease-out',
        color: isLastElement ? (isNewElement ? "black" : "red") : undefined,
      },
      messageRowRight: {
        display: "flex",
        justifyContent: "flex-end",
        transition: 'color 2s ease-out',
        color: isLastElement ? (isNewElement ? "black" : "red") : undefined,
      },
      messageBlue: {
        marginBottom: "10px",
        marginLeft: "20px",
        marginRight: "20px",
        padding: "10px",
        textAlign: "left",
        borderRadius: "10px",
        border: "1px solid #A8DDFD",
      },
      messageOrange: {
        position: "relative",
        marginRight: "20px",
        marginLeft: "20px",
        marginBottom: "10px",
        padding: "10px",
        textAlign: "right",
        borderRadius: "10px",
        border: "1px solid #dfd087",
      },
      messageContent: {
        padding: 0,
        margin: 0,
      },
      deleteIcon: {
        display: "flex",
        justifyContent: "flex-end",
      },
      titleWithDeleteIcon: {
        display: "flex",
        alignItems: "center",
      },
    });
  });

interface MessageProps {
  id: number;
  message: string;
  time: string;
  user: string;
  isRight?: boolean;
  onRemove: (id: number, user: string) => void;
  isNewElement?: boolean;
  isLastElement?: boolean;
}

/**
 * The component to render the message box
 * @param {Object} props the props object
 * @param {number} props.id the id of the message
 * @param {string} props.message the value of the message
 * @param {string} props.time the time formatted
 * @param {string} props.user the user identifier of the message
 * @param {boolean} props.isRight the message has to display on the right or left side of the screen
 * @param {Function} props.onRemove the function to handle the remove of the message
 * @param {boolean} props.newElement is the new element added
 * @param {boolean} props.isLastElement is the last element added
 * @returns {React.ReactElement}
 */
const MessageComponent: React.FC<MessageProps> = ({
  id,
  message,
  time,
  user,
  isRight = false,
  onRemove = () => {},
  isNewElement = false,
  isLastElement = false,
}) => {
  // The value of the message
  const messageValue = message || "no message";

  // The time stamp
  const timestamp = time || "";

  // The user identifier
  const displayName = user || "";

  // The style of the message component
  const classes = useStyles({
    isNewElement,
    isLastElement,
  })();

  const [elementHovered, setElementHovered] = useState<boolean>(false);

  const onRemoveHandler = useCallback((id: number, user: string) => {
    onRemove(id, user);
  }, [onRemove]);

  if (isRight) {
    return (
      <div className={classes.messageRowRight}>
        <div className={classes.messageOrange}>
          <div>
            {displayName} {timestamp}
          </div>
          <p className={classes.messageContent}>{messageValue}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.messageRow}>
      <div
        className={classes.messageBlue}
        onMouseOver={() => {
          setElementHovered(true);
        }}
        onMouseLeave={() => {
          setElementHovered(false);
        }}
      >
        <div className={classes.titleWithDeleteIcon}>
          {timestamp} {displayName}
          {elementHovered ? (
            <div className={classes.deleteIcon}>
              <IconButton
                onClick={() => {
                  onRemoveHandler(id, user);
                }}
              >
                <Cancel />
              </IconButton>
            </div>
          ) : undefined}
        </div>
        <div>
          <p className={classes.messageContent}>{messageValue}</p>
        </div>
      </div>
    </div>
  );
};

MessageComponent.displayName = "Message Component";

const Message = memo(MessageComponent) as typeof MessageComponent;

export default Message;
