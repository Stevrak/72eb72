const setLastSeen = (convo) => {
  const { messages, otherUser } = convo;
  if (!messages) return;
  let unseen = convo.unseen || 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId !== otherUser.id) {
      if (unseen === 0) {
        convo.lastSeen = messages[i].id;
        return;
      }
      unseen--;
    }
  }
  return 0;
}

export const addConversationsToStore = (state, conversations) => {
  console.log(conversations)
  return conversations.map((convo) => {
    setLastSeen(convo);
    return convo;
  })
}

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;

  // even if sender is provided, we may have 'fake' conversation with user
  if (sender){
    const conversation = state.find(c => c.otherUser.id === sender.id)
    if (!conversation) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
          unread: 1,
          unseen: 0
        };
        newConvo.latestMessageText = message.text;
        return [newConvo, ...state];
    }else{
      // the conversation doesn't have conversationId yet
      conversation.id = message.conversationId
    }
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      if (convo.messages.find(m => m.id === message.id)) {
        return convo;
      }
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      if (message.senderId === convo.otherUser.id)
        convoCopy.unread += 1;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = {
        ...convo
      };
      convoCopy.otherUser = {
        ...convoCopy.otherUser,
        online: true
      };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = {
        ...convoCopy.otherUser,
        online: false
      };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = {
        otherUser: user,
        messages: [],
        unread:0,
        unseen:0,
      };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.unread = 0;
      convoCopy.unseen = 1;
      setLastSeen(convoCopy);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

// either we trigger, or socket emit from other user triggers
// so confirm which user to trigger unseen or unread
export const setReadConversation = (state, conversationId, userId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      if (userId === convo.otherUser.id) {
        convoCopy.unseen = 0;
        setLastSeen(convoCopy)
      } else
        convoCopy.unread = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
