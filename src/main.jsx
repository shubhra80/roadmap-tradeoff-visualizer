import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Privacy from "./privacy.jsx";
import Terms from "./Terms.jsx";
import "./index.css";

const path = window.location.pathname;
let page = <App />;
if (path === "/privacy") page = <Privacy />;
if (path === "/terms") page = <Terms />;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{page}</React.StrictMode>
);