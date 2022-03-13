import {
  findAllTuits,
  findTuitById,
  findTuitByUser,
  createTuit,
  updateTuit,
  deleteTuit
} from '../services/tuits-service.js'
import { createUser, deleteUsersByUsername } from '../services/users-service';

describe('can create tuit with REST API', () => {
  // sample user to post a tuit
  const tesla = {
    username: 'Tesla',
    password: 'Model3',
    email: 'elon@tesla.com'
  };


  // sample tuit to insert
  const teslaTuit = {
    tuit: 'Whos excited for the new Tesla truck?? I know I am!'
  };

  // variables to store the ids of our tuit and user so that we can delete them later.
  var uid = null;
  var tid = null;

  // setup the tests
  beforeAll(async () => {
    // delete all other users with this username and insert our user. Record his id
    await deleteUsersByUsername(tesla.username);
    const user = await createUser(tesla);
    uid = user._id;
  })

  // Clean up after our test
  afterAll(async () => {
    // Delete the tuit and then delete the user
    await deleteTuit(tid);
    await deleteUsersByUsername(tesla.username);
  })

  test('can insert new tuits with REST API', async () => {
    // Inser the new tuit in the database and record their id
    const newTuit = await createTuit(uid, teslaTuit);
    tid = newTuit._id;

    // verify the tuits properties are correct
    expect(newTuit.uid).toEqual(uid);
    expect(newTuit.tuit).toEqual(teslaTuit.tuit);
  });
});

describe('can delete tuit wtih REST API', () => {
  // sample user to post a tuit
  const united = {
    username: 'United',
    password: 'unitedAirlines123',
    email: 'airplane@united.com'
  };


  // sample tuit to insert
  const unitedTuit = {
    tuit: 'Get Spring Break deals now on our website!'
  };

  // variables to store the ids of our tuit and user so that we can delete them later.
  var uid = null;
  var tid = null;

  // setup the tests
  beforeAll(async () => {
    // delete all other users with this username and insert our user. Record his id
    await deleteUsersByUsername(united.username);
    const user = await createUser(united);
    uid = user._id;
    const tuit = await createTuit(uid, unitedTuit);
    tid = tuit._id;
  })

  // Clean up after our test
  afterAll(async () => {
    // Delete the tuit and then delete the user
    await deleteTuit(tid);
    await deleteUsersByUsername(united.username);
  })

  test('can delete tuits with REST API', async () => {
    // Delete the new tuit
    const status =  await deleteTuit(tid);

    // verify a tuit was deleted
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
  // sample user to post a tuit
  const mbta = {
    username: 'MBTA',
    password: 'RedSoxx',
    email: 'mbta@ma.gov'
  };


  // sample tuit to insert
  const mbtaTuit = {
    tuit: 'Orange line service is suspended between Forrest Hills and Roxbury Crossing this weekend.'
  };

  // variables to store the ids of our tuit and user so that we can delete them later.
  var uid = null;
  var tid = null;

  // setup the tests
  beforeAll(async () => {
    // delete all other users with this username and insert our user. Record his id
    await deleteUsersByUsername(mbta.username);
    const user = await createUser(mbta);
    uid = user._id;
  })

  // Clean up after our test
  afterAll(async () => {
    // Delete the tuit and then delete the user
    await deleteTuit(tid);
    await deleteUsersByUsername(mbta.username);
  })

  test('can find tuits by id with REST API', async () => {
    // Insert the new Tuit
    const newTuit = await createTuit(mbtaTuit);
    tid = newTuit._id;

    // verify the tuit is correct
    expect(newTuit.uid).toEqual(uid);
    expect(newTuit.tuit).toEqual(mbtaTuit.tuit);

    // Get the tuit by id
    const tuit = await findTuitById(tid);

    // verify the tuits properties are correct
    expect(tuit.uid).toEqual(uid);
    expect(tuit.tuit).toEqual(mbtaTuit.tuit);
  });
});

describe('can retrieve all tuits with REST API', () => {
  // sample user to post a tuit
  const neu = {
    username: 'NortheasternU',
    password: 'husky123',
    email: 'paws@northeastern.edu'
  };


  // sample tuit to insert
  const tuits = [
    "Congrats to NEU Hockey for winning both Men's and Women's Hockey East!", 
    "Happy St Patty's Day!", 
    "Khoury Open House happening today in WVH at 3:30!"
  ];

  // variables to store the ids of our tuit and user so that we can delete them later.
  var uid = null;
  var tids = [];

  // setup the tests
  beforeAll(async () => {
    // delete all other users with this username and insert our user. Record his id
    await deleteUsersByUsername(neu.username);
    const user = await createUser(neu);
    uid = user._id;
    tuits.map(async (tuit) => {
      const newTuit = await createTuit(uid, tuit);
      tids.concat(newTuit._id);
    })
  })

  // Clean up after our test
  afterAll(async () => {
    // Delete the tuits and then delete the user
    tids.map(tid =>
      deleteTuit(tid));
    await deleteUsersByUsername(neu.username);
  })

  test('can find all tuits with REST API', async () => {
    // Get the all of the tuits
    const tuits = await findAllTuits();

    // verify we have at leas the tuits we inserted
    expect(tuits.length).toBeGreaterThanOrEqual(tuits.length);

    // filter out the tuits we didn't insert and make sure our tuits look good
    const ourTuits = tuits.filter(
      tuit => tids.indexOf(tuit._id) >= 0);

    ourTuits.forEach(tuit => {
      const tuitContent = tuits.find(t => t === tuit.tuit);
      expect(tuit.tuit).toEqual(tuitContent);
    });  
  });
});