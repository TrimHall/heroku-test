import { connectDb, disconnectDb } from './helpers.js';
import CraftBeer from '../models/craftBeer.js';
import User from '../models/user.js';
import Brewery from '../models/brewery.js';

const ADMIN_USER = {
  username: 'admin',
  password: 'Password!1',
  email: 'admin@admin.com',
  isAdmin: true,
  cloudinaryImageId: 'nmryrhbgsuz2r3t29o3x'
};

const NON_ADMIN_USER = {
  username: 'nonadmin',
  password: 'Password!1',
  email: 'nonadmin@nonadmin.com'
};

const beavertownBeers = [
  {
    name: 'Gamma Ray',
    description:
      'The rich and refreshing taste is perfect for those wanting to really explore our world of flavour. This is our original craft beer icon, our American dream, inspired by those great pale ales from California’s pacific coast.',
    type: 'American Pale Ale',
    strength: 5.4,
    image:
      'https://cdn.shopify.com/s/files/1/1563/1935/products/beavertown-brewery-gamma-ray-american-pale-ale-beer-can_deba6729-cd81-483f-a143-ba1498ff0ae0_600x600.png?v=1665770541'
  },
  {
    name: 'Neck oil',
    description:
      'The light and zingy taste of Neck Oil is the perfect place to start your craft beer journey. We’ve created a perfect balance of hop flavours to deliver an extra special taste.',
    type: 'Session IPA',
    strength: 4.3,
    image:
      'https://cdn.shopify.com/s/files/1/1563/1935/products/beavertown-brewery-neck-oil-session-ipa-beer-can_28a49ad7-4166-43a2-86e9-5668e6b8c078_600x600.png?v=1665785888'
  },
  {
    name: 'Lupuloid',
    description:
      'We reinforced the body of the beer with oats and wheat, before adding lots of heavy-duty hops, Ekuanot for  mango and papaya, Mosaic for citrus and pine and zingy Citra for a massive hop hit that keeps you coming back for more.',
    type: 'IPA',
    strength: 6.7,
    image:
      'https://cdn.shopify.com/s/files/1/1563/1935/products/beavertown-brewery-lupuloid-ipa-beer-can_9f6e7a13-aabf-4673-b010-6d9d4970118d_600x600.png?v=1665759723'
  },
  {
    name: 'Nanobot',
    description:
      'This light, crisp, 2.8%, 86 calorie per can, pintsized powerhouse packs flavours and aromas of hoppy citrus and pineapple so your taste goals are not compromised.',
    type: 'Super Session IPA',
    strength: 2.8,
    image:
      'https://cdn.shopify.com/s/files/1/1563/1935/products/beavertown-brewery-beer-nanobot-super-session-ipa-can_47bde888-0330-4789-9b98-97d1b7903f73_600x600.png?v=1665781453'
  },
  {
    name: `Bloody 'Ell`,
    description:
      'It all starts with a great, fruity and bitter IPA but we twist it up by adding Blood Orange pulp and some outrageously orangey hops, resiny Columbus, zingy Citra, fruity Simcoe and orangey Amarillo.',
    type: 'Blood Orange IPA',
    strength: 2.8,
    image:
      'https://cdn.shopify.com/s/files/1/1563/1935/products/beavertown-brewery-bloody-ell-blood-orange-ipa-beer-can_600x600.png?v=1665772090'
  }
];

const tinyRebelBeers = [
  {
    name: 'Clwb Tropica',
    description:
      'This is what happens when you slice PINEAPPLES, squeeze MANGOS, crush PEACHES and pummel PASSIONFRUIT into an IPA.',
    type: 'Tropical IPA',
    strength: 5.5,
    image:
      'https://www.tinyrebel.co.uk/uploads/images/products/verylarge/tiny-rebel-clwb-tropica-1609942438Clwb-Tropica.png'
  }
];

async function seedDb() {
  // connect to the database
  console.log('🤖 Connecting to mongodb');
  await connectDb();
  console.log('🤖 Successful connection to mongodb');

  // clear out the database
  console.log('🤖 Deleting beers');
  await CraftBeer.deleteMany({});
  console.log('🤖 Successfully deleted beers');
  console.log('🤖 Deleting users');
  await User.deleteMany({});
  console.log('🤖 Successfully deleted users');
  console.log('🤖 Deleting breweries');
  await Brewery.deleteMany({});
  console.log('🤖 Successfully deleted breweries');

  // create a user
  const [user, adminUser] = await User.create([NON_ADMIN_USER, ADMIN_USER]);
  console.log('🤖 Successfully created admin user with id', user._id);

  // create beavertown brewery
  const beavertownBrewery = await Brewery.create({ name: 'Beavertown' });
  console.log('🤖 Created Beavertown brewery', beavertownBrewery._id);
  console.log('🤖 Creating Beavertown beers');
  // create beavertown beers
  const updatedBeavertownBeers = beavertownBeers.map((beer) => ({
    ...beer,
    addedBy: user._id,
    brewery: beavertownBrewery._id
  }));
  const beavertownBeersFromDb = await CraftBeer.create(updatedBeavertownBeers);

  await Brewery.findOneAndUpdate(
    { _id: beavertownBrewery._id },
    { $push: { beers: beavertownBeersFromDb.map((b) => b._id) } }
  );

  // create tiny rebel brewery
  const tinyRebelBrewery = await Brewery.create({ name: 'Tiny Rebel' });
  console.log('🤖 Created Tiny Rebel brewery', tinyRebelBrewery._id);
  console.log('🤖 Creating Tiny Rebel beers');
  // create tiny rebel beers
  const updatedTinyRebelBeers = tinyRebelBeers.map((beer) => ({
    ...beer,
    addedBy: adminUser._id,
    brewery: tinyRebelBrewery._id
  }));
  const tinyRebelBeersFromDb = await CraftBeer.create(updatedTinyRebelBeers);

  await Brewery.findOneAndUpdate(
    { _id: tinyRebelBrewery._id },
    { $push: { beers: tinyRebelBeersFromDb.map((b) => b._id) } }
  );

  await disconnectDb();
  console.log('🤖 Successfully disconnected from mongodb');
}

seedDb();
