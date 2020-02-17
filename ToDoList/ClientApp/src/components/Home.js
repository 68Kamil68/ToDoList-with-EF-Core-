import React, { Component } from 'react';
import Todo from './Todo/Todo';
import './Home.css';

export class Home extends Component {
  static displayName = Home.name;
  state = {
    logged: false,
    userID: 0,
    todos: [{value: 'kokok'}, {value:'kokos'}]
  }

  loginForm = {
    nickname: '',
    password: ''
  }

  error = false;
  errorMessage = null;

  updateFieldNick = (e) => {
    this.loginForm = {
      ...this.loginForm,
      nickname: e.target.value
    }
  }

  updateField = (e) => {
    this.loginForm = {
      ...this.loginForm,
      [e.target.name]: e.target.value
    }
  }
  

  validateLoginForm = () => {
    if (!this.loginForm.nickname | !this.loginForm.password)
    {
      this.error = true;
      this.errorMessage = 'Uzupelnij dane logowania';
      return false;
    }
    return true;
  }

  login = (e) => {
    console.log(this.loginForm);
    if(this.validateLoginForm())
    {
      this.setState({logged: true});
    }
    else
    {
      this.setState({logged: false});
    }
  }

  render () {
    let loginView = null;
    let todosView = null;
    if(!this.state.logged) {
      loginView = (
        <div className="login">
            <p className="logPas">Login:</p>
            <input type="text"  className="input" name="nickname" onChange={this.updateField}/>
            <br/>
            <p className="logPas">Password:</p>
            <input type="password" className="input" name="password" onChange={this.updateField}/>
            <p>{this.errorMessage}</p>
            <button onClick = {this.login}>Log in</button>
            <button>Register</button>
        </div>
      )
    };

    if(this.state.logged)
    {
      todosView = (
        <Todo Todos= {this.state.todos}/>
      )
    }

    return (
        <div className="Home">
            {loginView}
            {todosView}
      </div>
    );
  }
}
