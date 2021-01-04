import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { ModalBackground } from '../components/Modals/partials/Background';
import { useWhoAmI } from '../hooks/useQuery/useWhoAmI';
import { Home } from '../pages/Home';
import { Trip } from '../pages/Trip';
import { Trips } from '../pages/Trips';

export const Router = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
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
