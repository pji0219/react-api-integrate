// useReducer로 API 상태관리

// App.js
import React from 'react';
import User from './components/users';


function App() {
    return <User/>;
}

export default App;


// User.js
import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

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

function User() {

    const [state, dispatch] = useReducer(reducer, {  // reducer 사용
      loading: false,
      data: null,
      error: null,
    });

    const fetchUsers = async () => {
        dispatch({ type: 'LOADING' }); // 페이지 시작시 LOADING 액션을 줌
        try {
            const response = await axios.get(
                'https://jsonplaceholder.typicode.com/users/'
            );
            dispatch({ type: 'SUCCESS', data: response.data }); // API 에서 데이터 조회된 뒤 SUCCESS 액션을 줌
        } catch (e) {
            dispatch({ type: 'ERROR', error: e }); // 에러가 날 시 EORROR 액션을 줌
        }
    }
   
    useEffect(() => {
        fetchUsers();
    }, []);

    const { loading, data: users, error } = state; // data를 users 키워드로 조회
   if (loading) return <div>로딩중..</div>
   if (error) return <div>에러가 발생 하였습니다.</div>
   if (!users) return null;

    return(
        <div>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} ({user.name})
                    </li>
                ))}
            </ul>
            <button onClick={fetchUsers}>다시 불러오기</button>
        </div>
    );
}

export default User;