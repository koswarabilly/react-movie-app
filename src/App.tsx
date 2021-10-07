import React from 'react';
import { List, Detail } from './pages';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <List />
        </Route>
        <Route path="/detail/:id">
          <Detail />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
