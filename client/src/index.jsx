import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import css from "./styles/index.css";
import App from "./components";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);
