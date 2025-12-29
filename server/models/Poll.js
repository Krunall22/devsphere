const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);