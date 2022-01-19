const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id,user1Id) {
  const conversations = await Conversation.find({
    where: {
      users: {
        [Op.in]: [users1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversations;
};

module.exports = Conversation;
