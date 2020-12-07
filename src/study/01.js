// 1. API 연동의 기본

// App.js
import React from 'react';
import User from './components/users';


function App() {
    return <User/>;
}

export default App;


// user.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setUsers(null);
            setError(null);
            setLoading(true);
            const response = await axios.get(
                'https://jsonplaceholder.typicode.com/users/'
            );
            setUsers(response.data);
        } catch (e) {
            console.log(e.response.status);
            setError(e);
        }
        setLoading(false);
    }
   
    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div>로딩중..</div>
    if (error) return <div>에러가 발생하였습니다.</div>
    if (!users) return null;

    return(
        <>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} ({user.name})
                    </li>
                ))}
            </ul>
            <button onClick={fetchUsers}>다시 불러오기</button>
        </>
    );
}

export default User;