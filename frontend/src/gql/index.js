import { gql, useMutation } from "@apollo/client";

const GET_EMAIL = gql`query GetAccounts {
    accounts {
        email
        userName
        blockedUsers {
          email
        }
      }
}`;


//MUTATIONS
const ADD_BLOCKED_USER = gql`
  mutation AddBlockedUser($type: ObjectId!) {
    addBlockedUser(type: $type) {
      id
      type
    }
  }
`;

export { GET_EMAIL, ADD_BLOCKED_USER };
