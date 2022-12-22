const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  published: { type: Boolean, required: true },
});

postSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_SHORT);
});

postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Posts', postSchema);
