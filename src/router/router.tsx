import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Home } from '../pages/Home';
import { Trips } from '../pages/Trips';

export const Router = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <BrowserRouter>
      <Switch>
        {!isLoggedIn && (
          <Route path="/" exact>
            <Home />
          </Route>
        )}
        <Route path="/:username" exact>
          <Trips />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
