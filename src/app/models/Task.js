const mongoose = require("../../database");
const TaksSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Task = mongoose.model("Task", TaksSchema);

module.exports = Task;
