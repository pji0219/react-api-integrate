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