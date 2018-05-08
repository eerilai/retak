import type from './types';

// EXAPMLE =>
/*
export const actionFunc = () => {
	return {
		type: CHANGE_STORE,
		payload: {
			newState: 'New state',
			anotherState: 'something'
		}
	}
}
*/

export const login = (username) => (
  {
    type: type.LOGGEDIN,
    payload: username
  }
);

export const toggleLoginLogout = (status) => (
  {
    type: type.TOGGLE_LOGIN_LOGOUT,
    payload: status
  }
);

export const setLoggedInPlayers = (player1, player2) => (
  {
    type: type.SET_LOGGEDIN_PLAYERS,
    payload:{
      player1,
      player2
    }
  }
)