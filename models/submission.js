// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student:String,
  title: String,
  status: { type: String, enum: ['None','Pending', 'Approved'], default: 'Pending' },
  marks: Number,
  comments: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
});

module.exports = mongoose.model('submissions', submissionSchema);
