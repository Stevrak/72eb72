const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// increment or clear unread count for a user in conversation
const adjustUnread = async ({userId, conversationId, conversation, clear}) => {
  try {
    if (!conversation)
      conversation = await Conversation.findOne({
        where:{
          id:conversationId,
          [Op.or]: {
            user1Id: userId,
            user2Id: userId,
          }
        }
      })
    const urIndex = conversation.user1Id == userId? 0 : 1;
    // to ensure psql picks up that unread array is actually changed and updates
    // reassign array then update with new copy.
    let newArray = Object.assign([...conversation.unread],conversation.unread);
    if (clear)
      newArray[urIndex] = 0;
    else
      newArray[urIndex] = newArray[urIndex] + 1;

    await conversation.update({unread:newArray});
    return;
  }catch (error) {
    return;
  }
}

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      await adjustUnread({userId:recipientId, conversationId})
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    await adjustUnread({userId:recipientId, conversation})
    res.json({ message, senderId });
  } catch (error) {
    next(error);
  }
});

// expects {conversationId} in body
router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { id } = req.user;
    const { conversationId } = req.body;

    await adjustUnread({userId:id, conversationId, clear:true})
    res.sendStatus(204);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
