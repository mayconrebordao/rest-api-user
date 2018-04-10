const mongoose = require("../../database");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  userTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
