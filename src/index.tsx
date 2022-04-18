import { createRoot } from "react-dom/client";
import "./style/index.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = createRoot(document.getElementById("root") as Element);

root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);

reportWebVitals();
