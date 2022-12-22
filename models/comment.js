const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const commentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
});

commentSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_SHORT);
});

commentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Comments', commentSchema);
