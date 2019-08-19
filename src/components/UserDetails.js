import React from 'react';
import auth from '../services/authService';

export default function UserDetails(params) {
    const { user } = params;
    const onLoginClick = () => auth.login()
    const onLogout = () => auth.logOut()

    let loginOrLogout = (<button onClick={onLoginClick}>
        Login or Register
        </button>)
    if (user) {
        loginOrLogout = (
            <span>
                Hello {user.profile.nickname}
                <button onClick={onLogout}>LOG OUT</button>
            </span>
        )
    }
    return <div>
        {loginOrLogout}
    </div>
}