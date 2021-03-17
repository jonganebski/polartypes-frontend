import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { isLoggedInVar } from '../apollo/reactive-variables';
import { Loading } from '../components/Loading';
import { NotFound } from '../components/NotFound404';
import { useWhoAmI } from '../hooks/useQuery/useWhoAmI';
import { Home } from '../pages/Home';
import { Trip } from '../pages/Trip';
import { Trips } from '../pages/Trips';

export const Router = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { me } = useWhoAmI();
  return (
    <BrowserRouter>
      <Switch>
        {isLoggedIn && !me && <Loading />}
        {isLoggedIn && me && <Redirect from="/" to={`/${me.username}`} exact />}
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
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
