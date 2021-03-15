import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { client } from './apollo/apollo';
import App from './components/App';
import { MapInteractionCtxProvider } from './context';
import reportWebVitals from './reportWebVitals';
import './styles/styles.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MapInteractionCtxProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </MapInteractionCtxProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
