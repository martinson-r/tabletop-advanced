import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useQuery, useMutation, useLazyQuery
  } from "@apollo/client";
import { GET_ABOUT, GET_GAMES_PLAYING_IN, START_NEW_PRIVATE_CHAT, UPDATE_BIO, CHECK_FOLLOW_PLAYER, FOLLOW_PLAYER, UNFOLLOW_PLAYER, CHECK_FOLLOW } from "../../gql"
import './bio.css';

function Bio() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const [currentUserId, setCurrentUserId] = useState(null);
const { userId } = useParams();
const [recipients, setRecipients] = useState([]);
const [firstName, setFirstName] = useState("");
const [bio, setBio] = useState("");
const [pronouns, setPronouns] = useState("");
const [avatarUrl, setAvatarUrl] = useState("");
const [following, setFollowing] = useState(false);

const history = useHistory();

useEffect(() => {
    if (sessionUser !== undefined && sessionUser !== null) {
        setCurrentUserId(sessionUser.id);
    }
},[sessionUser])

const [getAbout, { data }] = useLazyQuery(GET_ABOUT);
// const [checkFollowPlayer, { data: checkfollowData }] = useQuery(CHECK_FOLLOW_PLAYER);
const { data: checkFollowData } = useQuery(CHECK_FOLLOW_PLAYER, { variables: { currentUserId, userId } });

const [startNewNonGameConversation] = useMutation(START_NEW_PRIVATE_CHAT, { variables: { currentUserId, recipients }, onCompleted: startNewNonGameConversation => { history.push(`/conversation/${startNewNonGameConversation.startNewNonGameConversation.id}`)} } );
const [updateBio, { data: updatedData }] = useMutation(UPDATE_BIO);
const [followPlayer, { data: followData }] = useMutation(FOLLOW_PLAYER);
const [unFollowPlayer, { data: unfollowData }] = useMutation(UNFOLLOW_PLAYER);
// Force query to not use cache so that new characters show up right away
const [getGamesPlayingIn, {loading: loadingPlayingIn, data: playingInData}] = useLazyQuery(GET_GAMES_PLAYING_IN, {
    fetchPolicy: 'network-only'
    });

const sendNewMessage = () => {
    //TODO: Refactor for multiple recipients in an array. In this case, there won't be
    //but this makes the resolver reusable for conversations with multiple recipients
startNewNonGameConversation({recipients, currentUserId});
}

useEffect(() => {
    if (userId !== null && userId !== undefined) {
        getAbout({ variables: { userId }})
        getGamesPlayingIn({ variables: { userId }});

    }
},[userId, getAbout]);

useEffect(() => {
 if (data !== undefined) {
    if (userId !== null && userId !== undefined) {
     setRecipients([data.about[0].User.userName]);
     console.log('Playing In ', playingInData);
    }
    if (data !== undefined) {
        setFirstName(data.about[0].firstName);
        setPronouns(data.about[0].pronouns);
        setBio(data.about[0].bio);
        setAvatarUrl(data.about[0].avatarUrl);
    }
 }
},[data, userId]);

useEffect(() => {
    if (checkFollowData !== undefined) {
        if (checkFollowData.checkFollowPlayer !== null) {
            setFollowing(true);
        }
    }
},[checkFollowData])

const handleSubmit = (e) => {
    e.preventDefault();
    // setErrors([]);
    updateBio({ variables: { currentUserId, userId, firstName, bio, pronouns, avatarUrl } });

    const description = document.getElementById("user-description");
    const form = document.getElementById("edit-form");
    const button = document.getElementById("edit-button");
    form.classList.add("edit-hidden");
    button.classList.remove("edit-hidden");
    description.classList.remove("edit-hidden");

}

let followThePlayer = () => {
    setFollowing(true);
    followPlayer({ variables: { currentUserId, userId }});
}

let unFollowThePlayer = () => {
    setFollowing(false);
    unFollowPlayer({ variables: { currentUserId, userId }});
}


const edit = () => {
const description = document.getElementById("user-description");
const form = document.getElementById("edit-form");
const button = document.getElementById("edit-button");

if (form.classList.contains("edit-hidden")) {
    form.classList.remove("edit-hidden");
    button.classList.add("edit-hidden");
    description.classList.add("edit-hidden");
}
}

return (
    <div className="container">
    <div className="gray-backdrop">
    {data !== undefined &&
    (<div id="user-description"><p>About {data.about[0].User.userName}:</p>
    {/* TODO: Follow player */}
   {following === !true && (
       <button onClick={followThePlayer}>Follow This Player</button>
   )}
   {following === true && (
       <button onClick={unFollowThePlayer}>Unfollow This Player</button>
   )}
   <h3>Games this user is playing in:</h3>
   {playingInData && playingInData.getGamesPlayingIn.map((game) => <div><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link></div>)}
    <br />
    {avatarUrl && (<div><img className="avatarUrl" src={avatarUrl} /></div>)}
    {/* Conditional edit buttons based on whether user or not */}
    {/* Edit form fields directly */}
    {/* Toggle public display of information */}
    <p>Name: {firstName}</p>
    {pronouns && (<p>Pronouns: {pronouns}</p>)}
    <p>A Little Bit About Me: {bio}</p>
    {console.log('userId', userId, 'current', currentUserId, currentUserId === userId)}
    </div>)}
    {currentUserId !== null && parseInt(currentUserId) !==  parseInt(userId) && (<button onClick={sendNewMessage}>Send this user a private message</button>)}
    {currentUserId !== null &&  parseInt(currentUserId) ===  parseInt(userId) && (<div>

        <button id="edit-button" onClick={edit}>Edit</button>
        <div id="edit-form" className="edit-hidden">
        <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required/>
                <label>Bio</label>
                <input type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required/>
                <label>Portrait Image URL (optional)</label>
                <input type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <label>Pronouns (optional)</label>
                <input type="text"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                />
                <button type="submit">Save</button>
            </form>
        </div>
        </div>
    )}
    {currentUserId === null && (<p>Please <Link to={`/login`}>log in</Link> to send this user a message.</p>)}
    </div>
    </div>
)


}

export default Bio;
