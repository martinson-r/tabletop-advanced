import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ModalProvider } from './context/Modal';
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
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';



import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';;


// import { restoreCSRF, fetch } from './store/csrf';
// import * as sessionActions from './store/session';
//split communication by operation so we don't use ws for everything
const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
});

let wsLink;

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  const token = Cookies.get('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
      // authorization: token ? `Bearer ${token}` : "",
    }
  }
});



//websocket endpoint changes depending on development vs production
if (process.env.NODE_ENV !== "production") {
  wsLink = new WebSocketLink({
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
} else {
  wsLink = new WebSocketLink({
    uri: "wss://tabletop-advanced.herokuapp.com/subscriptions",
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
}

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

const cache = new InMemoryCache({});

// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//     fields: {

//     convos: {
//                 keyArgs: [],
//                 merge(existing = {rows: []}, incoming, { args: { offset = 0 }}) {
//                   // Slicing is necessary because the existing data is
//                   // immutable, and frozen in development.

//                   //Note: Sorting does not work in cache.

//                   console.log('EXISTING', existing)
//                   console.log('INCOMING', incoming)

//                   //gotta figure out how to merge these two objects.
//                     const merged = existing ? existing.rows.slice(0) : [];
//                     for (let i = 0; i < incoming.rows.length; ++i) {
//                         merged[offset + i] = incoming.rows[i];
//                   }
//                   console.log('MERGED', merged)

//                   return ({rows: merged, count: incoming.count});
//                 },
//           }
//           },
//         }
//       }

// });




// const client = new ApolloClient({
//   //uri of graphql backend
//   link: splitLink,
//   cache: cache

// });


const client = new ApolloClient({
  //uri of graphql backend
  link: authLink.concat(splitLink),
  cache: cache

});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
      </ModalProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
