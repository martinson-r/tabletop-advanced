import { gql } from "@apollo/client";

const GET_EMAIL = gql`query GetAccounts {
    accounts {
        email
        blockedUsers {
          email
        }
      }
}`;

export { GET_EMAIL };
