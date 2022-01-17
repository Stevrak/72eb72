import React from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  unread: {
    marginRight:20,
    background: "#3F92FF",
    borderRadius: "14px",
    minWidth:20,
    maxHeight:20,
    textAlign:"center",
    padding:"5px 2px 5px 2px",
  },
  unreadText: {
    fontFamily:"Open Sans",
    fontSize: "10px",
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: "-0.5px",
    margin: "0px 5px",
    lineHeight:1
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {conversation.unread>0 &&
      <Box className={classes.unread}>
        <Typography className={classes.unreadText}>
          {conversation.unread}
        </Typography>
      </Box>
      }
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
