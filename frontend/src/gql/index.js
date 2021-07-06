import { gql, useMutation } from "@apollo/client";

const GET_ACCOUNTS = gql`query GetAccounts {
    accounts {
        _id
        email
        userName
        blockedUsers {
          email
        }
      }
}`;

const GET_CURRENT_ACCOUNT = gql`
    query GetCurrentAccount($userId: ID!) {
        account(_id: $userId){
            _id
            email
            userName
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

export { GET_ACCOUNTS, GET_CURRENT_ACCOUNT, ADD_BLOCKED_USER };
