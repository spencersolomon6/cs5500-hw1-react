import * as likeService from "../services/dislikes-service";
import * as tuitService from "../services/tuits-service";
import * as userService from "../services/users-service";


describe('userTogglesTuitDislike', () => {
    // sample user to insert
    const alice = {
        username: 'alice123',
        password: 'alicePassword',
        email: 'alice123@gmail.com'
    }

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
        const response = await likeService.userTogglesTuitDislikes(uid, tid);
        const likedTuit = await tuitService.findTuitById(tid);
        expect(response.status).toEqual(200);
        expect(likedTuit.stats.likes).toEqual(1);

        // Ensure the unlike request suceeds and the tuit has 0 likes
        const secondResponse = await likeService.userTogglesTuitDislikes(uid, tid);
        const unlikedTuit = await tuitService.findTuitById(tid);
        expect(secondResponse.status).toEqual(200);
        expect(unlikedTuit.stats.likes).toEqual(1);
    });
});