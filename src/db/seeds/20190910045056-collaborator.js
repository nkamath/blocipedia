'use strict';

let collaborators = [];
collaborators.push({
  userId: 1,
  wikiId: 3,
  createdAt: new Date(),
  updatedAt: new Date()
},{
  userId: 5,
  wikiId: 3,
  createdAt: new Date(),
  updatedAt: new Date()
},{
  userId: 3,
  wikiId: 3,
  createdAt: new Date(),
  updatedAt: new Date()
}
);

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert("Collaborators", collaborators, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete("Collaborators", null, {});
  }
};
