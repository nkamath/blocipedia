const Collaborator = require("./models").Collaborator;

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
  }
}