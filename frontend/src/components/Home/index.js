import { useEffect, useState } from "react";
import { GET_EMAIL } from "../../gql";
import {
    useQuery,
  } from "@apollo/client";

function Home() {

    const [accounts, setAccounts] = useState([]);

    const getallAccounts = async() => {
        const getAccounts = await fetch("http://localhost:5000/api/users");
        const newAccounts = await getAccounts.json();
        setAccounts(newAccounts.accounts);
    }

    const { loading, error, data } = useQuery(GET_EMAIL);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error}</p>;

    if (!data.accounts) {
        console.log('DATA', data)

        return (
        <p>No accounts found.</p>
        )
    }

    if (data.accounts) {
        console.log('DATA2', data);
        return (
            <div>
            {data.accounts.map(account => <><p>{account.email}</p>
            <p>Blocked Users are: {account.blockedUsers.map(blockedUser => blockedUser.email)}</p></>
            )}
            </div>

        )
    }
}

export default Home;
