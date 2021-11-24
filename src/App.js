import { Fragment } from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import './App.css';
import { Login, Dashboard }from "./Components";

function App() {

  return(
    <Fragment>

      <Router>
        <Switch>
          <Route path="/Dashboard">
            <Dashboard/>
          </Route>

          <Route path="/" exact>
            <Login/>
          </Route>
        </Switch>
      </Router>
    </Fragment>
  )
}

export default App;
