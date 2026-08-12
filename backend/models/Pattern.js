const mongoose = require('mongoose');

const PatternSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    recognize: { type: String, default: '' },
    apply: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pattern', PatternSchema);
