import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import configureStore from './store';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  split,
  HttpLink
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';


import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';;


// import { restoreCSRF, fetch } from './store/csrf';
// import * as sessionActions from './store/session';
//split communication by operation so we don't use ws for everything
const httpLink = new HttpLink({
  uri: '/graphql'
});


const wsLink = new WebSocketLink({
  uri: "ws://localhost:5000/subscriptions",
  options: {
    options: {
      reconnect: true,

      //tweak for session auth
      // connectionParams: {
      //   authToken: user.authToken,
      // },
    },
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const store = configureStore();

const client = new ApolloClient({
  //uri of graphql backend
  link: splitLink,

  //cache query results after fetching
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        Part: {
          parts: {
            fields: {
              convos: { merge(existing, incoming) {
                return incoming;
              },
            },
              messageAdded: { merge(existing, incoming) {
                return incoming;
              },
            },
          }
          }
        }
      }
    }
  })
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
