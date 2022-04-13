import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import route from "./route";
import Home from "../screen/home";

const Routers = () => {
    return (
        <Router>
            <Switch>
                <Route path={route.HOME} component={Home} />
            </Switch>
        </Router>
    );
};
export default Routers;
