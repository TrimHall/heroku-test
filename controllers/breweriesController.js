import Brewery from '../models/brewery.js';
import CraftBeer from '../models/craftBeer.js';
import mongoose from 'mongoose';

async function createNewBrewery(req, res, next) {
  try {
    const newBrewery = await Brewery.create(req.body);

    await CraftBeer.updateMany(
      { _id: newBrewery.beers },
      { $push: { brewery: newBrewery._id } }
    );

    return res.status(201).json(newBrewery);
  } catch (e) {
    next(e);
  }
}

async function getAllBreweries(_req, res, next) {
  try {
    const breweries = await Brewery.find();
    return res.status(200).json(breweries);
  } catch (e) {
    next(e);
  }
}

async function getAllBeersForBrewery(req, res, next) {
  try {
    const brewery = await Brewery.findById(req.params.id).populate('beers');
    return res.status(200).json(brewery);
  } catch (e) {
    next(e);
  }
}

async function deleteBrewery(req, res, next) {
  if (req.currentUser.isAdmin) {
    try {
      await Brewery.findByIdAndDelete(req.params.id);

      const beers = await CraftBeer.updateMany(
        { brewery: req.params.id },
        { $unset: { brewery: 1 } }
      );

      return res.status(200).send({ message: 'Successfully delete brewery' });
    } catch (error) {
      next(error);
    }
    return;
  }

  return res.status(301).send({ message: 'Unathorized' });
}

export default {
  createNewBrewery,
  getAllBreweries,
  getAllBeersForBrewery,
  deleteBrewery
};
