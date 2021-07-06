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

const GET_GAMES = gql`
    query GetAllGames {
       games {
        _id
        title
        description
       }
    }
`;

const GET_GAME = gql`
    query GetSingleGame($gameId: ID!) {
       game(_id: $gameId){
        _id
        title
        description
       }
    }
`;

const GET_GAME_CONVOS = gql`
    query GetGameConvos($gameId: ID) {
       convos(gameId: $gameId){
            messages {
              userId {
                  email
              }
              messageText
            }
       }
    }
`;

//MUTATIONS
const ADD_BLOCKED_USER = gql`
  mutation AddBlockedUser($email: String) {
    addBlockedUser(email: $email) {
      id
      email
    }
  }
`;

const SEND_MESSAGE_TO_GAME = gql`
  mutation SendMessageToGame($gameId: ID, $userId: ID, $messageText: String) {
    sendMessageToGame(gameId: $gameId, userId: $userId, messageText: $messageText) {
        gameId
        messages {
            userId {
                email
            }
            messageText
      }
    }
  }
`;

export { GET_ACCOUNTS,
        GET_CURRENT_ACCOUNT,
        ADD_BLOCKED_USER,
        GET_GAMES,
        GET_GAME,
        GET_GAME_CONVOS,
        SEND_MESSAGE_TO_GAME };
