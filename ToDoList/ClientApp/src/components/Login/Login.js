import React from 'react';
import './Login.css';

const login = (props) => {
    props.id = 10;
    return (
        <div className="login">
            <p className="logPas">Login:</p>
            <input type="text" value={props.nickname}  className="input"/>
            <br/>
            <p className="logPas">Password:</p>
            <input type="password" value={props.password} className="input"/>
            <br/>
            <button onClick = {props.clicked}>Log in</button>
            <button>Register</button>
        </div>
        )
}

export default login;