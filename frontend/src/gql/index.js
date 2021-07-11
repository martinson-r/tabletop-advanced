import { gql, useMutation } from "@apollo/client";

const GET_ACCOUNTS = gql`query GetAccounts {
    users {
        id
        email
        userName
        blockedUsers {
          email
        }
      }
}`;

const GET_CURRENT_ACCOUNT = gql`
    query GetCurrentAccount($userId: ID!) {
        user(id: $userId){
            id
            email
            userName
        }
    }`;

const GET_GAMES = gql`
    query GetAllGames {
       games {
        id
        title
        description
        host {
            userName
        }
       }
    }
`;

const GET_GAME = gql`
    query GetSingleGame($gameId: ID!) {
       game(id: $gameId){
        id
        title
        description
        host {
            userName
        }
       }
    }
`;

const GET_WAITLIST_STATUS = gql`
    query CheckWaitlist($id: ID!, $userId: ID!) {
        checkWaitList(id: $id, userId: $userId) {
            id
            title
            description
        }
    }
`;

const GET_GAME_CONVOS = gql`
    query GetGameConvos($gameId: ID) {
       convos(gameId: $gameId){
            sender {
                userName
            }
            id
            messageText
       }
    }
`;

const GET_NON_GAME_NON_SPEC_CONVOS = gql`
query GetNonGameNonSpecConvos($userId: ID) {
    getNonGameMessages(userId: $userId){
        recipients {
            email
        }
        message {
            messageText
        }
    }
}
`;

const GET_GAME_CREATION_INFO = gql`
query GetGameCreationInfo {
    getGameCreationInfo {
        languages {
            language
        }
        rulesets {
            ruleset
        }
        gameTypes {
            type
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
            sender {
                id
                userName
            }
            messageText
      }
    }
`;

const SUBMIT_GAME = gql`
  mutation SubmitToGame($userId: ID, $titleText: String, $descriptionText: String) {
    submitGame(userId: $userId, title: $titleText, description: $descriptionText) {
            id
            title
            description
            host {
                userName
            }
        }
}
`;

const SUBMIT_WAITLIST_APP = gql`
  mutation SubmitWaitlistApp($userId: ID, $charName: String, $charConcept: String, $whyJoin: String, $experience: String, $gameId: ID) {
    submitWaitlistApp(userId: $userId, charName: $charName, charConcept: $charConcept, whyJoin: $whyJoin, experience: $experience, gameId: $gameId) {
                id
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
    sendNonGameMessage(userId: $userId, messageText: $messageText, id: $messageId){
        message {
           id
           User {
               id
               email
           }
        messageText
        }
    }
}
`;

const GAME_MESSAGES_SUBSCRIPTION = gql`
subscription OnMessageSent($gameId: ID!) {
    messageSent(gameId: $gameId) {
      messageText
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
        SUBMIT_GAME,
        SUBMIT_WAITLIST_APP,
        GET_WAITLIST_STATUS,
        GET_GAME_CREATION_INFO
     };
