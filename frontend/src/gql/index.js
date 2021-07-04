import { gql, useMutation } from "@apollo/client";

const GET_EMAIL = gql`query GetAccounts {
    accounts {
        email
        blockedUsers {
          email
        }
      }
}`;


//MUTATIONS
const ADD_BLOCKED_USER = gql`
  mutation AddBlockedUser($type: Account!) {
    addBlockedUser(type: $type) {
      id
      type
    }
  }
`;

export { GET_EMAIL, ADD_BLOCKED_USER };
