import CraftBeer from '../models/craftBeer.js';

async function createReview(req, res, next) {
  try {
    const beer = await CraftBeer.findById(req.params.id);

    if (!beer) {
      return res.status(404).send({ message: 'Beer not found' });
    }

    console.log('req is', req.body);

    const newReview = {
      ...req.body,
      reviewer: req.currentUser._id
    };

    beer.reviews.push(newReview);

    const rating =
      beer.reviews.reduce((acc, review) => acc + review.rating, 0) /
      beer.reviews.length;

    beer.set({ rating: rating.toFixed(3) });
    const savedBeer = await beer.save();

    return res.status(201).json(savedBeer);
  } catch (error) {
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const beer = await CraftBeer.findById(req.params.id);

    if (!beer) {
      return res.status(404).send({ message: 'No beer found' });
    }

    const review = beer.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).send({ message: 'No review found' });
    }

    if (!review.reviewer.equals(req.currentUser._id)) {
      return res.status(301).send({
        message: 'Unathorized: you can not update another users review'
      });
    }

    review.set(req.body);

    const rating =
      beer.reviews.reduce((acc, review) => acc + review.rating, 0) /
      beer.reviews.length;

    beer.set({ rating: rating.toFixed(3) });
    const savedBeer = await beer.save();

    return res.status(200).json(savedBeer);
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    const beer = await CraftBeer.findById(req.params.id);

    if (!beer) {
      return res.status(404).send({ message: 'No beer found' });
    }

    const review = beer.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).send({ message: 'No review found' });
    }

    if (
      !review.reviewer.equals(req.currentUser._id) &&
      !req.currentUser.isAdmin
    ) {
      console.log(req.currentUser);
      return res.status(401).send({ message: 'Unathorized' });
    }

    review.remove();

    const rating =
      beer.reviews.reduce((acc, review) => acc + review.rating, 0) /
      beer.reviews.length;

    if (rating) {
      beer.set({ rating: rating.toFixed(3) });
    } else {
      beer.rating = undefined;
    }

    const savedBeer = await beer.save();

    return res.status(200).json(savedBeer);
  } catch (error) {
    next(error);
  }
}

export default { createReview, updateReview, deleteReview };
