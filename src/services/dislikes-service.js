import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const USERS_API = `${BASE_URL}/api/users`;

const api = axios.create({
    withCredentials: true
});

/**
 * 
 * @param {string} uid the user id of the user to toggle the dislike button for 
 * @param {string} tid the tuit id of the tuit to be disliked
 * @returns the tuit object after the like toggle has been performed
 */
export const userTogglesTuitDislikes = (uid, tid) =>
    api.put(`${USERS_API}/${uid}/dislikes/${tid}`)
        .then(response => response.data);

/**
 * 
 * @param {string} userId the user id of the user to find disliked tuits for 
 * @returns an array of tuits disliked by the given user
 */
export const findAllTuitsDislikedByUser = (userId) =>
    api.get(`${USERS_API}/${userId}/dislikes`)
        .then(response => response.data);