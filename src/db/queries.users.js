const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  }, 
  upgrade(id) {
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.update({ role: 2 });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  
  downgrade(id) {
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.update({ role: 0 });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  getAllUsers(callback) {
    return User.findAll()
      .then((users) => {
        callback(null, users);
      })
      .catch((err) => {
        callback(err);
      })
  }
}