const Sequelize = require("sequelize");
const db = require("../db");

const ConversationUser = sequelize.define('ConversationUser', {
  ConversationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Conversation,
      key: 'id'
    }
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  unread: {
    type:Datatypes.INTEGER
  }
});

exports.default = ConversationUser;
