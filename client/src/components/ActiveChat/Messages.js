import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box , Avatar } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 20,
    width: 20,
    marginRight: 0,
    marginTop: 9
  }
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, lastSeen } = props;
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time}>
          {
            message.id === lastSeen && (
              <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
            )
          }
          </SenderBubble>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
      );
    })}
    </Box>
  );
};

export default Messages;
