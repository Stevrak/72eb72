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

// returns id of message other member has seen last
const getLastSeen = (messages, userId, unseen) => {
    if (!messages) return;
    for( let i = messages.length-1;i>=0;i--){
        if (messages[i].senderId === userId){
          if (unseen === 0)
            return messages[i].id;
          else
            unseen--;
        }
    }
}

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, unseen } = props;
  const lastSeen = getLastSeen( messages, userId, unseen)

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
