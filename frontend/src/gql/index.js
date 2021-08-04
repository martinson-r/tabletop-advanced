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
                id
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

const GET_RULESETS = gql`
    query GetAllRulesets {
       rulesets {
            id,
            ruleset
       }
    }
`;

const GET_PLAYING_WAITING_GAMES = gql`
    query GetPlayingWaitingGames($userId: ID) {
        getPlayingWaitingGames(userId: $userId) {
            id
            player {
              id
              title
              host {
                  userName
              }
            }
            applicant {
              id
              title
              host {
                userName
              }
              Applications {
                id
                accepted
                charName
                offerAccepted
              }
            }
        }
    }
`

const GET_WAITING_LIST_GAMES = gql`
query GetWaitlistGames($userId: ID) {
    getWaitlistGames(userId: $userId) {
        id
        title
        host {
            userName
        }
  applicant {
    id
    userName
    applicationOwner {
      id
      accepted
      offerAccepted
      charName
    }
  }
}
}
`

//TODO: add player character data and characterId to Player Joins and pull in that info
const GET_GAMES_PLAYING_IN = gql`
query GetGamesPlayingIn($userId: ID) {
    getGamesPlayingIn(userId: $userId) {
        id
        title
        host {
            userName
        }
    }
}
`;

const GET_GAME = gql`
    query GetSingleGame($gameId: ID!) {
        game(gameId: $gameId) {
            id
        title
        description
        active,
        allowPlayerEdits,
        allowPlayerDeletes,
        waitListOpen,
        active,
        host {
            userName
            id
        }
        player {
            userName
            id
        }
        Characters {
            name
            User {
                userName
            }
        }
        Applications {
            id
            charName
            ignored
            accepted
            createdAt
            applicationOwner {
                id
                 userName
               }
    }
        }
    }
`;

const GET_CHARACTER = gql`
query GetCharacter($userId: ID, $gameId: ID) {
    character(userId: $userId, gameId: $gameId) {
        name
        imageUrl
    }
}
`

const GET_CHARACTER_BY_ID = gql`
query GetCharacterById($characterId: ID) {
    characterById(characterId: $characterId) {
        name
        bio
        imageUrl
        User {
            userName
            id
        }
        Game {
            title
            id
        }
    }
}
`

//Get games a player is hosting
//Grab waitlist info as well so they can see new apps
const GET_HOSTED_GAMES = gql`
query MyGames($userId: ID) {
    getGamesHosting(userId: $userId) {
        id
  title
  Applications {
    id
    ignored
    accepted
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

const GET_WAITLIST_APPLIED = gql`
    query CheckApplied($gameId: ID, $userId: ID) {
        checkApplied(gameId: $gameId, userId: $userId) {
           id
        }
    }
`;

const GET_APPLICATION = gql`
query GetApplication($gameId: ID, $applicationId: ID) {
    getApplication(gameId: $gameId, applicationId: $applicationId) {
            id
            Games {
                id
                title
                host {
                    id
                }
            }
            whyJoin
            charConcept
            charName
            experience
            accepted
            ignored
            applicationOwner {
              id
              userName
            }
          }
}
`

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
            spectatorChat
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
        recipient {
            id
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
            id
            language
        }
        rulesets {
            id
            ruleset
        }
        gameTypes {
            id
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
  mutation SendMessageToGame($gameId: ID, $userId: ID, $messageText: String, $spectatorChat: Boolean) {
    sendMessageToGame(gameId: $gameId, userId: $userId, messageText: $messageText, spectatorChat: $spectatorChat) {
        count
        rows {
            sender {
                id
                userName
            }
            id
            messageText
            spectatorChat
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
            spectatorChat
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
        spectatorChat
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

const APPROVE_APPLICATION = gql`
mutation ApproveApplication($applicationId: ID) {
    approveApplication(applicationId: $applicationId) {
        id
        accepted
        ignored
    }
}
`

const IGNORE_APPLICATION = gql`
mutation IgnoreApplication($applicationId: ID) {
    ignoreApplication(applicationId: $applicationId) {
        id
        accepted
        ignored
    }
}
`

const ACCEPT_OFFER = gql`
mutation AcceptOffer($applicationId: ID, $userId: ID, $gameId: ID) {
    acceptOffer(applicationId: $applicationId, userId: $userId, gameId: $gameId) {
        id
        offerAccepted
    }
}
`

const DECLINE_OFFER = gql`
mutation DeclineOffer($applicationId: ID) {
    declineOffer(applicationId: $applicationId) {
        id
        offerAccepted
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
  mutation SubmitWaitlistApp($hostId: ID, $userId: ID, $charName: String, $charConcept: String, $whyJoin: String, $experience: String, $gameId: ID) {
    joinWaitlist(hostId: $hostId, userId: $userId, charName: $charName, charConcept: $charConcept, whyJoin: $whyJoin, experience: $experience, gameId: $gameId) {
                id

    }
}
`;

const EDIT_WAITLIST_APP = gql`
  mutation EditWaitlistApp($applicationId: ID, $userId: ID, $charName: String, $charConcept: String, $whyJoin: String, $experience: String, $gameId: ID) {
    editWaitlistApp(applicationId: $applicationId, userId: $userId, charName: $charName, charConcept: $charConcept, whyJoin: $whyJoin, experience: $experience, gameId: $gameId) {
                id
                whyJoin
                charConcept
                charName
                experience

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

const START_NEW_PRIVATE_CHAT = gql`
mutation StartNewPrivateChat($currentUserId: ID, $recipients: [String]) {
    startNewNonGameConversation(currentUserId: $currentUserId, recipients: $recipients) {
        id
    }
}
`;

const ADD_RECIPIENT = gql`
mutation AddRecipient($recipientName: String, $conversationId: ID) {
    addRecipient(recipientName: $recipientName, conversationId: $conversationId) {
        id
        userName
    }
}
`

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
            spectatorChat
            createdAt
            deleted
       }
    }
  }
`;

const SPECTATOR_MESSAGES_SUBSCRIPTION = gql`
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
            spectatorChat
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
            spectatorChat
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
        GET_RULESETS,
        GET_GAME,
        GET_CHARACTER,
        GET_CHARACTER_BY_ID,
        GET_PLAYING_WAITING_GAMES,
        GET_GAMES_PLAYING_IN,
        GET_WAITING_LIST_GAMES,
        GET_APPLICATION,
        APPROVE_APPLICATION,
        IGNORE_APPLICATION,
        ACCEPT_OFFER,
        DECLINE_OFFER,
        GET_HOSTED_GAMES,
        GET_GAME_CONVOS,
        SEND_MESSAGE_TO_GAME,
        ADD_RECIPIENT,
        EDIT_MESSAGE,
        DELETE_MESSAGE,
        GET_NON_GAME_NON_SPEC_MESSAGES,
        GET_USER_NON_GAME_CONVOS,
        SEND_NON_GAME_NON_SPEC_MESSAGES,
        START_NEW_PRIVATE_CHAT,
        GAME_MESSAGES_SUBSCRIPTION,
        NON_GAME_MESSAGES_SUBSCRIPTION,
        SPECTATOR_MESSAGES_SUBSCRIPTION,
        SUBMIT_GAME,
        SUBMIT_WAITLIST_APP,
        EDIT_WAITLIST_APP,
        GET_WAITLIST_STATUS,
        GET_WAITLIST_APPLIED,
        GET_GAME_CREATION_INFO,
        CHANGE_EMAIL,
        CHANGE_PASSWORD,
     };
