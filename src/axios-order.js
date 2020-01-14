import axios from "axios";

const instance = axios.create({
  baseURL: "https://burgerbuilder-a1cd3.firebaseio.com/"
});

export default instance;
