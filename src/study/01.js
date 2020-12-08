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

    const fetchUsers = async () => { // fetchUsers 함수를 밖으로 꺼내줌
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
        fetchUsers(); // useEffect에서는 fetchUsers함수를 호출 해줌
    }, []);

    if (loading) return <div>로딩중..</div>
    if (error) return <div>에러가 발생 하였습니다.</div>
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
            <button onClick={fetchUsers}>다시 불러오기</button> {/* 버튼 클릭시 API 재요청 되게 함수 연결 */}
        </>
    );
}

export default User;