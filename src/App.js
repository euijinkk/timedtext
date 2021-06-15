import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MainPage, LoginPage, MyPage, RegisterPage } from './pages';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={()=> <MainPage />} />
        <Route exact path="/login" component={()=> <LoginPage />} />
        <Route exact path="/register" component={()=> <RegisterPage />} />
        <Route exact path="/my" component={()=> <MyPage />} />
      </Switch>
    </Router>
  );
};

export default App;