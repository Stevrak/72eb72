const Sequelize = require("sequelize");
const { Op , DataTypes } = Sequelize;
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  unread: {
    type:DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false
  }
});
// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// create new conversation with default attributes

Conversation.create = async function ({ user1Id, user2Id }) {
  // check for existing beforehand
  let conversation = await Conversation.findConversation(user1Id, user2Id);

  if (!conversation){
    conversation = await Conversation.build ({user1Id, user2Id, unread:[0,0]})
    await conversation.save();
  }

  return conversation;
}


module.exports = Conversation;
