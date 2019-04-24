import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components";
import store from "./store";
import { Provider } from "react-redux";

console.log("hi");
console.log(process.env);

const prod = process.env.NODE_ENV === "production";

(async () => {
    await import(`bootstrap/dist/css/bootstrap${prod && ".min"}.css`);
    ReactDOM.render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>,
        document.getElementById("app")
      );
})();
