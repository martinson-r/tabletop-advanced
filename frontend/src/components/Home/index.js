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
  if (error) return <p>Error :(</p>;

    if (!data.accounts) {
        return (
        <p>No accounts found.</p>
        )
    }

    if (data.accounts) {
        return (
            <div>
            {data.accounts.map(account => <><p><b>{account.email}</b></p>
            {account.blockedUsers.length > 0 && (
            <p>Blocked Users for {account.email} are: {account.blockedUsers.map(blockedUser => blockedUser.email)}</p>)}
            </>
            )}
            </div>
        )
    }
}

export default Home;
