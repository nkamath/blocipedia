const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;

module.exports = {
  getCollaboratorsForWiki(wikiId, callback) {
    return Collaborator.findAll({
        where: {
          wikiId: wikiId
        }
      })
      .then((collaborators) => {
        callback(null, collaborators);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getCollaborationsForUser(user, callback) {
    return Collaborator.findAll({
        where: {
          userId: user.id
        }
      })
      .then((collaborations) => {
        callback(null, collaborations);
      })
      .catch((err) => {
        callback(err);
      })
  },

  updateCollaborators(req, callback) {
    return Wiki.findByPk(req.params.id)
      .then((wiki) => {
        Collaborator.findAll({
          where: {
            wikiId: wiki.id
          }
        }).then((collaborators) => {
          // Delete existing collaborators
          collaborators.forEach(collaborator => {
            collaborator.destroy().catch((err) => {
              callback(err);
            });
          });

          // Refresh with new collaborators for the wiki
          for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
              Collaborator.create({
                wikiId: req.params.id,
                userId: key
              }).catch((err) => {
                callback(err);
              })
            }
          }
        });
        callback(null, wiki);
      });
  }
}