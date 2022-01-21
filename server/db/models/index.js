const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationUser = require("./conversationUser");
// associations

User.hasMany(Conversation);
Conversation.belongsToMany(User, { through: ConversationUser });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  ConversationUser,
};
