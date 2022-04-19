import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import route from "./route";
import Home from "../screen/home";
const Routers = () => {
    return (
        // <Home />
        <Router>
            <Routes>
                <Route path={route.HOME} element={<Home />} />
            </Routes>
        </Router>
    );
};
export default Routers;
