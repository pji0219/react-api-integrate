// 커스텀 useAsync 만들어서 API 연동하기

// useAsync.js
import { useReducer, useEffect } from 'react';

// LOADING, SUCCESS, ERROR 세가지 액션을 관리
function reducer(state, action) {
    switch (action.type) {
      case 'LOADING':
        return {
          loading: true,
          data: null,
          error: null,
        }
      case 'SUCCESS':
        return {
          loading: false,
          data: action.data,
          error: null,
        }
      case ' ERROR':
        return {
          loading: false,
          data: null,
          error: action.error,
        }
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
}

/* callback에는 API를 호출하는 함수를 받아오고 deps에는 useEffect의 두번째 파라미터를 받아옴
  사용자의 요청이 있을 때만 데이터를 요청을 하기 위해 세번째 파라미터에는 skip을 지정해줌 */
function useAsync(callback, deps=[], skip = false) { 
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        data: null,
        error: null
    });

    const fetchData = async () => {
        dispatch({ type: 'LOADING' });
        try {
            const data = await callback();
            dispatch({ type: 'SUCCESS', data });
        } catch(e) {
            dispatch({ type: 'ERROR', error: e});
        }
    }

    useEffect(() => {
        if(skip) {
          return;
        }
        fetchData();
    }, deps);

    return [state, fetchData];
}

export default useAsync;


// User.js
import React from 'react';
import axios from 'axios';
import useAsync from './useAsync';

async function getUser(id) {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
    return response.data;
}

function User({ id }) {
    const [state] = useAsync(() => getUser(id), [id]);
    const { loading, error, data: user} = state;

    if(loading) return <div>로딩중..</div>;
    if(error) return <div>에러가 발생 하였습니다.</div>;
    if(!user) return null;

    return (
        <div>
            <h2>{user.username}</h2>
            <p>
                <b>Email: </b> {user.email}
            </p>
        </div>
    );
}

export default User;


// users.js
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


// App.js
import React from 'react';
import Users from './components/users';


function App() {
    return <Users/>;
}

export default App;