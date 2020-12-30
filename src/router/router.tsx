import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { useWhoAmI } from '../hooks/useWhoAmI';
import { Home } from '../pages/Home';
import { Trip } from '../pages/Trip';
import { Trips } from '../pages/Trips';

export const Router = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data: userData } = useWhoAmI();
  return (
    <BrowserRouter>
      <Switch>
        {isLoggedIn && userData && (
          <Redirect from="/" to={`/${userData.whoAmI.username}`} exact />
        )}
        {!isLoggedIn && (
          <Route path="/" exact>
            <Home />
          </Route>
        )}
        <Route path="/:username" exact>
          <Trips />
        </Route>
        <Route path="/:username/:tripId" exact>
          <Trip />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
