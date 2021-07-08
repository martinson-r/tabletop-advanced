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
            _id
            messages {
              _id
              userId {
                  _id
                  email
              }
              messageText
            }
       }
    }
`;

const GET_NON_GAME_NON_SPEC_CONVOS = gql`
query GetNonGameNonSpecConvos($userId: ID) {
    getNonGameMessages(userId: $userId){
        recipients {
            email
        }
        messages {
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
        _id
        messages {
            _id
            userId {
                _id
                email
            }
            messageText
      }
    }
  }
`;

const SUBMIT_GAME = gql`
  mutation SubmitToGame($userId: ID, $titleText: String, $descriptionText: String) {
    submitGame(userId: $userId, title: $titleText, description: $descriptionText) {
            _id
            title
            description
            host {
                email
            }
        }
}
`;

const SEND_NON_GAME_NON_SPEC_CONVOS = gql`
mutation SendNonGameNonSpecConvos($userId: ID, $messageText: String, $messageId: ID) {
    sendNonGameMessage(userId: $userId, messageText: $messageText, _id: $messageId){
        messages {
           _id
           userId {
               _id
               email
           }
        messageText
        }
    }
}
`;

const GAME_MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageAdded($gameId: ID!) {
    messageAdded(gameId: $gameId) {
        _id
        messages {
         _id
         userId {
            _id
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
        SEND_MESSAGE_TO_GAME,
        GET_NON_GAME_NON_SPEC_CONVOS,
        SEND_NON_GAME_NON_SPEC_CONVOS,
        GAME_MESSAGES_SUBSCRIPTION,
        SUBMIT_GAME
     };
