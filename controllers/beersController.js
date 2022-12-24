import CraftBeer from '../models/craftBeer.js';
import Brewery from '../models/brewery.js';

const getAllBeers = async (_req, res, next) => {
  try {
    const beers = await CraftBeer.find();
    return res.status(200).json(beers);
  } catch (e) {
    next(e);
  }
};

const createNewBeer = async (req, res, next) => {
  try {
    const beer = await CraftBeer.create({
      ...req.body,
      addedBy: req.currentUser._id
    });

    await Brewery.findOneAndUpdate(
      { _id: beer.brewery },
      { $push: { beers: beer._id } }
    );

    return res.status(201).json(beer);
  } catch (e) {
    next(e);
  }
};

const getSingleBeer = async (req, res, next) => {
  try {
    const beer = await CraftBeer.findById(req.params.id)
      .populate('brewery')
      .populate('reviews.reviewer');
    return beer
      ? res.status(200).json(beer)
      : res.status(404).json({ message: `No beer with id ${req.params.id}` });
  } catch (e) {
    next(e);
  }
};

const updateSingleBeer = async (req, res, next) => {
  try {
    if (req.currentUser._id.equals(beer.addedBy) || req.currentUser.isAdmin) {
      const beer = await CraftBeer.findById(req.params.id);
      beer.set(req.body);
      const updatedBeer = await beer.save();
      return res.status(200).json(updatedBeer);
    }

    return res.status(301).json({ message: 'Unauthorized' });
  } catch (e) {
    next(e);
  }
};

const deleteSingleBeer = async (req, res, next) => {
  try {
    const beer = await CraftBeer.findById(req.params.id);

    if (req.currentUser._id.equals(beer.addedBy) || req.currentUser.isAdmin) {
      await CraftBeer.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Succesfully deleted beer' });
    }

    return res.status(301).json({ message: 'Unauthorized' });
  } catch (e) {
    next(e);
  }
};

async function searchBeers(req, res, next) {
  console.log(req.query);
  try {
    const { search } = req.query;
    const beers = await CraftBeer.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ]
    });
    return res.status(200).json(beers);
  } catch (error) {
    next(error);
  }
}

// where we dynamically add the search query and the search query value
// async function searchBeers(req, res, next) {
//   console.log(req.query);
//   try {
//     const { searchBy, searchValue } = req.query;
//     const beers = await CraftBeer.find({
//       [searchBy]: { $regex: searchValue, $options: 'i' }
//     });
//     return res.status(200).json(beers);
//   } catch (error) {
//     next(error);
//   }
// }

export default {
  getAllBeers,
  createNewBeer,
  getSingleBeer,
  updateSingleBeer,
  deleteSingleBeer,
  searchBeers
};
