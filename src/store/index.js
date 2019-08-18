import User from "./User";
import Home from './Home';
import Transaction from './Transacsion'
import OnApp from "./OnApp";
import EnterAddress from './EnterAddress'

const stores = {
  User,
  Home,
  Transaction,
  OnApp,
  EnterAddress,
};

export default {
  ...stores
};
