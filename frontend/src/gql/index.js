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

const GET_USER = gql`
    query GetCurrentAccount($userId: ID!) {
        user(id: $userId){
            id
            email
            userName
        }
    }`;

    const GET_ABOUT = gql`
    query GetAccount($userId: ID!) {
        about(id: $userId){
            firstName
            pronouns
            bio
            User {
                userName
            }
        }
    }`;

const GET_GAMES = gql`
    query GetAllGames {
       games {
        id
        title
        active
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
        allowPlayerEdits,
        allowPlayerDeletes,
        active,
        host {
            userName
            id
        }
       }
    }
`;

//Maybe just grab waitlists and games they are a player in at the same time
//Possibly add hostId to Application so I can see
//If they are hosting as well
const MY_GAMES = gql`
query MyGames($userId: ID) {
    getMyGames(userId: $userId) {
        id
        title
        accepted
        isPlayer
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
    query GetGameConvos($gameId: ID, $offset: Int) {
       convos(gameId: $gameId, offset: $offset){
        count
        rows {
            id
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
       }
    }
}
`;

//Get non-game conversations associated with user
const GET_USER_NON_GAME_CONVOS = gql`
query GetNonGameConvos($userId: ID!) {
    getNonGameConvos(userId: $userId){
        id
    recipient {
        recipient {
            userName
        }
    }
}
}
`;

//Get messages associated with non-game conversation
const GET_NON_GAME_NON_SPEC_MESSAGES = gql`
query GetNonGameNonSpecConvos($conversationId: ID, $offset: Int) {
    getNonGameMessages(conversationId: $conversationId, offset: $offset){
        count
        rows {
            id
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
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
        count
        rows {
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
       }
        }
      }
`;

const EDIT_MESSAGE = gql`
mutation EditMessage($messageId: ID, $userId: ID, $editMessageText: String) {
editMessage(messageId: $messageId, userId: $userId, editMessageText: $editMessageText) {
    count
        rows {
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
       }
    }
}
`

const DELETE_MESSAGE = gql`
mutation DeleteMessage($messageId: ID, $userId: ID) {
deleteMessage(messageId: $messageId, userId: $userId) {
    count
    rows {
        sender {
            id
            userName
        }
        id
        messageText
        createdAt
        deleted
   }
 }
}
`

const CHANGE_EMAIL = gql`
mutation ChangeEmail($userId: ID!, $newEmail: String!, $changeEmailPassword: String!) {
    changeEmail(userId: $userId, newEmail: $newEmail, changeEmailPassword: $changeEmailPassword) {
        id
        userName
        email
    }
}
`

const CHANGE_PASSWORD = gql`
mutation ChangePassword($userId: ID!, $newPassword: String!, $oldPassword: String!) {
    changePassword(userId: $userId, newPassword: $newPassword, oldPassword: $oldPassword) {
        id
        userName
        email
    }
}
`

//IDs are required on backend but if I don't mark them required on frontend,
//we get a 404...
//Took me forever to troubleshoot this.

const SUBMIT_GAME = gql`
  mutation SubmitGame($userId: ID!, $title: String!, $description: String!, $gameRulesetId: ID!, $gameTypeId: ID!, $gameLanguageId: ID!) {
    submitGame(userId: $userId, title: $title, description: $description, gameRulesetId: $gameRulesetId, gameTypeId: $gameTypeId, gameLanguageId: $gameLanguageId) {
        id
        title
        description
    }
}
`;

const SUBMIT_WAITLIST_APP = gql`
  mutation SubmitWaitlistApp($userId: ID, $charName: String, $charConcept: String, $whyJoin: String, $experience: String, $gameId: ID) {
    joinWaitlist(userId: $userId, charName: $charName, charConcept: $charConcept, whyJoin: $whyJoin, experience: $experience, gameId: $gameId) {
                id

    }
}
`;

//This is to send a non-game message to a conversation
const SEND_NON_GAME_NON_SPEC_MESSAGES = gql`
mutation SendNonGameNonSpecMessages($userId: ID!, $messageText: String!, $conversationId: ID) {
    sendNonGameMessages(userId: $userId, messageText: $messageText, conversationId: $conversationId){
        count
        rows {
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
       }
    }
}
`;

//This is to fetch all of the messages in a conversation
const GAME_MESSAGES_SUBSCRIPTION = gql`
subscription OnMessageSent($gameId: ID, $conversationId: ID) {
    messageSent(gameId: $gameId, conversationId: $conversationId) {
        count
        rows {
            id
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
       }
    }
  }
`;

const NON_GAME_MESSAGES_SUBSCRIPTION = gql`
subscription OnMessageSent($conversationId: ID!) {
    messageSent(conversationId: $conversationId) {
        count
        rows {
            id
            sender {
                id
                userName
            }
            id
            messageText
            createdAt
            deleted
       }
    }
  }
`;



export { GET_ACCOUNTS,
        GET_USER,
        GET_ABOUT,
        ADD_BLOCKED_USER,
        GET_GAMES,
        GET_GAME,
        GET_GAME_CONVOS,
        SEND_MESSAGE_TO_GAME,
        EDIT_MESSAGE,
        DELETE_MESSAGE,
        GET_NON_GAME_NON_SPEC_MESSAGES,
        GET_USER_NON_GAME_CONVOS,
        SEND_NON_GAME_NON_SPEC_MESSAGES,
        GAME_MESSAGES_SUBSCRIPTION,
        NON_GAME_MESSAGES_SUBSCRIPTION,
        SUBMIT_GAME,
        SUBMIT_WAITLIST_APP,
        GET_WAITLIST_STATUS,
        GET_GAME_CREATION_INFO,
        CHANGE_EMAIL,
        CHANGE_PASSWORD,
     };
