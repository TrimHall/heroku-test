import express from 'express';
import beersController from '../controllers/beersController.js';
import userController from '../controllers/userController.js';
import breweriesController from '../controllers/breweriesController.js';
import reviewsController from '../controllers/reviewsController.js';
import secureRoute from '../middleware/secureRoute.js';

const Router = express.Router();

Router.route('/crafty-beers')
  .get(beersController.getAllBeers)
  .post(secureRoute, beersController.createNewBeer);

Router.route('/crafty-beers/search').get(beersController.searchBeers);

Router.route('/crafty-beers/:id')
  .get(beersController.getSingleBeer)
  .put(secureRoute, beersController.updateSingleBeer)
  .delete(secureRoute, beersController.deleteSingleBeer);

Router.route('/breweries')
  .get(breweriesController.getAllBreweries)
  .post(secureRoute, breweriesController.createNewBrewery);

Router.route('/breweries/:id').delete(
  secureRoute,
  breweriesController.deleteBrewery
);

Router.route('/breweries/:id/craft-beers').get(
  breweriesController.getAllBeersForBrewery
);

Router.route('/crafty-beers/:id/reviews').post(
  secureRoute,
  reviewsController.createReview
);

Router.route('/crafty-beers/:id/reviews/:reviewId')
  .put(secureRoute, reviewsController.updateReview)
  .delete(secureRoute, reviewsController.deleteReview);

Router.route('/register').post(userController.registerUser);

Router.route('/login').post(userController.loginUser);

export default Router;
