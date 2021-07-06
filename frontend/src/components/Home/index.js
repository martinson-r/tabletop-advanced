import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useQuery,
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_ACCOUNTS } from "../../gql"

function Home() {

    // return (
    //     <p>derp</p>
    // )

    const dispatch = useDispatch();

    //Grab our session user
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser._id

    //grab our account
    const { loading, error, data } = useQuery(GET_CURRENT_ACCOUNT, { variables: { userId } }, );
    // const { loading, error, data } = useQuery(GET_ACCOUNTS);

    const [accounts, setAccount] = useState([]);
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);


    useEffect(() => {
        if (loading) {
            setLoading(loading);
        }
        if (error) {
            setError(error);
        }
        if (data) {
            setAccount(data);
            console.log('DATA:', data)
        }
    }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

    if (!data) {
        return (
        <p>No accounts found.</p>
        )
    }

    if (data) {
        console.log(data)
        const accountData = data.account[0];
        console.log(accountData)
        return (
            <div>
                <p>derp</p>
                <p>Your email: {accountData.email}</p>
            </div>
        )
    }
}

export default Home;
