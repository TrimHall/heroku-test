import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const reviewSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, max: 300 },
    reviewer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
  },
  { timestamps: true }
);

const craftBeerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, min: 1, max: 300 },
  type: { type: String, required: true },
  strength: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  brewery: { type: mongoose.Schema.ObjectId, ref: 'Brewery' },
  reviews: [reviewSchema]
});

craftBeerSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('CraftBeer', craftBeerSchema);
