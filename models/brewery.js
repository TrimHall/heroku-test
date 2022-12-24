import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const brewerySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  beers: [{ type: mongoose.Types.ObjectId, ref: 'CraftBeer' }]
  // the beers key on a brewer should be an array of craft beer ids
});

brewerySchema.plugin(mongooseUniqueValidator);

export default mongoose.model('Brewery', brewerySchema);
