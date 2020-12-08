import React, { useState } from 'react';
import axios from 'axios';
import useAsync from './useAsync';
import User from './User';

async function getUsers() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users/');
  return response.data;
}

function Users() {
    const [state, refetch] = useAsync(getUsers, [], true); // useAsync 커스텀 Hook 사용
    const [userId, setUserId] = useState(null);

    const { loading, data: users, error } = state; // data를 users 키워드로 조회
    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생 하였습니다.</div>;
    if (!users) return <button onClick={refetch}>불러오기</button>; // 불러오기 버튼을 눌러야 데이터가 요청 됨

    return(
        <div>
            <ul>
                {users.map(user => (
                    <li key={user.id} onClick={() => setUserId(user.id)}>
                        {user.username} ({user.name})
                    </li>
                ))}
            </ul>
            <button onClick={refetch}>다시 불러오기</button>
            {userId && <User id={userId}/>}
        </div>
    );
}

export default Users;