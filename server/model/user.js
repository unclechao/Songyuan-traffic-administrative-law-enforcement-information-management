var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String, match: /^1[3|4|5|8][0-9]\d{4,8}$/ },
  lastLoginTime: { type: Date },
  createTime: { type: Date },
  lockState: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  email: { type: String, match: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/ }
});

var User = mongoose.model("User", userSchema);

User.count().exec((err, count) => {
  if (err) {
    console.log(err);
  } else if (count < 1) {
    var initUsers = [
      { username: "admin", password: "7c4a8d09ca3762af61e59520943dc26494f8941b", isAdmin: true },
      { username: "test", password: "7c4a8d09ca3762af61e59520943dc26494f8941b" }
    ];
    User.insertMany(initUsers)
      .then(users => {
        console.log("User collection init successful");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = User;
