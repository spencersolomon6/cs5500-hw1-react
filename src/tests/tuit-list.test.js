import {Tuits} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {deleteTuit, findAllTuits} from "../services/tuits-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_USERS = [
  {username: 'alice', password: 'alice123', email: 'alice@gmail.com', _id: '123'}, 
  {username: 'alice', password: 'alice123', email: 'alice@gmail.com', _id: '234'},
  {username: 'alice', password: 'alice123', email: 'alice@gmail.com', _id: '345'}
];

const MOCKED_TUITS = [
  {tuit: "alice's tuit", user: "123", _id: "123"}, 
  {tuit: "bob's tuit", user: "234", _id: "234"}, 
  {tuit: "charlie's tuit", user: "345", _id: "345"}
];

test('tuit list renders static tuit array', () => {
  render(
    <HashRouter>
      <Tuits tuits={MOCKED_TUITS} deleteTuit={deleteTuit}/>
    </HashRouter>);
  const linkElement = screen.getByText(/alice's tuit/i);
  expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
  const tuits = await findAllTuits();
  render(
    <HashRouter>
      <Tuits tuits={tuits} deleteTuit={deleteTuit} />
    </HashRouter>);
  const linkElement = screen.getByText(/This is a my first tuit. Hi!/i);
  expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {tuits: MOCKED_TUITS}}));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
    <HashRouter>
      <Tuits tuits={tuits} deleteTuit={deleteTuit} />
    </HashRouter>);

  const linkElement = screen.getByText(/charlie's tuit/i);
  expect(linkElement).toBeInTheDocument();
});
