import * as dislikeService from "../services/dislikes-service";
import * as tuitService from "../services/tuits-service";
import * as userService from "../services/users-service";


describe('userTogglesTuitDislike', () => {
    // sample user to insert
    const alice = {
        username: 'alice123',
        password: 'alicePassword',
        email: 'alice123@gmail.com'
    };

    // sample tuit to insert
    const aliceTuit = {
        tuit: 'This is my first tuit! Excited for Tuiter!'
    };

    // variables to store our userId and tuitId
    var uid = null;
    var tid = null;

    // Setup our tests
    beforeAll(async () => {
        // delete users with this username and insert our user and their tuit. Record both ids.
        await userService.deleteUsersByUsername(alice.username);
        const user = await userService.createUser(alice);
        uid = user._id;
        const tuit = await tuitService.createTuit(uid, aliceTuit);
        tid = tuit._id;
    })

    // Cleanup after our tests
    afterAll(async () => {
        // Delete the tuit and user
        await tuitService.deleteTuit(tid);
        await userService.deleteUser(uid);
    })

    test('can successfully toggle the status of a user liking a tuit', async () => {
        // Ensure the tuit has no likes initially
        const originalTuit = await tuitService.findTuitById(tid);
        expect(originalTuit.stats.likes).toEqual(0);

        // Ensure the like request succeeds and the tuit has 1 like
        const response = await dislikeService.userTogglesTuitDislikes(uid, tid);
        const likedTuit = await tuitService.findTuitById(tid);
        expect(response.status).toEqual(200);
        expect(likedTuit.stats.likes).toEqual(1);

        // Ensure the unlike request suceeds and the tuit has 0 likes
        const secondResponse = await dislikeService.userTogglesTuitDislikes(uid, tid);
        const unlikedTuit = await tuitService.findTuitById(tid);
        expect(secondResponse.status).toEqual(200);
        expect(unlikedTuit.stats.likes).toEqual(1);
    });
});

describe('findAllTuitsDislikedByUser', () => {
    // sample users to insert
    const alice = {
        username: 'alice123',
        password: 'alicePassword',
        email: 'alice123@gmail.com'
    };
    const charlie = {
        username: 'charlie456',
        password: 'charliePassword',
        email: 'charlie456@msn.com'
    };

    // sample tuits to insert
    const aliceTuit1 = {
        tuit: 'This is my first tuit! Excited for Tuiter!'
    };
    const aliceTuit2 = {
        tuit: 'This is my second tuit! I love Tuiter!'
    };
    const aliceTuit3 = {
        tuit: 'This is my third tuit! Tuiter is so much fun!'
    };

    // variables to store the ids of all our users and tuits
    var aliceId = null;
    var charlieId = null;
    var tid1 = null;
    var tid2 = null;
    var tid3 = null;

    // Setup our tests
    beforeAll(async () => {
        // Delete any users with these ids which already exist
        await userService.deleteUsersByUsername(alice.username);
        await userService.deleteUsersByUsername(charlie.username); 

        // Create our users and document their ids.
        const aliceUser = await userService.createUser(alice);
        const charlieUser = await userService.createUser(charlie);
        aliceId = aliceUser._id;
        charlieId = charlieUser._id;

        // Create our tuits for Alice and record their ids
        const tuit1 = await tuitService.createTuit(aliceId, aliceTuit1);
        const tuit2 = await tuitService.createTuit(aliceId, aliceTuit2);
        const tuit3 = await tuitService.createTuit(aliceId, aliceTuit3);
        tid1 = tuit1._id;
        tid2 = tuit2._id;
        tid3 = tuit3._id;
    })

    // Cleanup after our tests
    afterAll(async () => {
        // Delete the tuits we created
        await tuitService.deleteTuit(tid1);
        await tuitService.deleteTuit(tid2);
        await tuitService.deleteTuit(tid3);

        // Delete the users we created
        await userService.deleteUser(aliceId);
        await userService.deleteUser(charlieId);
    })

    test('Validate that our list of Disliked tuits is intially empty and then is correct after disliking some tuits', async () => {
        const originalDislikedTuits = await dislikeService.findAllTuitsDislikedByUser(charlieId);
        expect(originalDislikedTuits).toHaveLength(0);

        await dislikeService.userTogglesTuitDislikes(charlieId, tid1);
        await dislikeService.userTogglesTuitDislikes(charlieId, tid3);
        const dislikedTuits = await dislikeService.findAllTuitsDislikedByUser(charlieId);
        expect(dislikedTuits).toHaveLength(2);
        expect(dislikedTuits[0]).toEqual(aliceTuit1);
        expect(dislikedTuits[1]).toEqual(aliceTuit2);
    });
});