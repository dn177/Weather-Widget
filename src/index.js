import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/i18n"; // Import i18n configuration

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
