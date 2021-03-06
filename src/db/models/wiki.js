'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }, 
    userId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
        as: "userId",
      }
    }
  }, {});
  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "SET NULL",
    });
    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators"
    }); 
 };
  return Wiki;
};