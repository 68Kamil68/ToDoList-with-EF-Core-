import React, { Component } from 'react';
import Todo from './Todo/Todo';
import './Home.css';

export class Home extends Component {
  static displayName = Home.name;
  state = {
    logged: false,
    userID: 0,
    todos: [{ todoID: 1, value: 'kokok' }, { todoID: 2, value: 'kokos' }],
    XP: null,
    Level: null
  }

  loginForm = {
    Nickname: '',
    Password: ''
  }

  error = false;
  errorMessage = null;


  updateField = (e) => {
    this.loginForm = {
      ...this.loginForm,
      [e.target.name]: e.target.value
    }
  }
  
  validateLoginForm = () => {
    if (!this.loginForm.Nickname | !this.loginForm.Password)
    {
      this.error = true;
      this.errorMessage = 'Uzupelnij dane logowania';
      return false;
    }
    return true;
  }

  getUserTodos = async (e) => {
      await fetch(`/api/Todos/GetUserTodos?UserID=${this.state.userID}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      }).then(res => res.json()).then(data => {
        console.log(data[0]);
        this.mapTodos(data[0]);
      });
  }
    // TODO: fix mapping todos
  mapTodos = (todosData) => {
    todosData.forEach(td => {
      let todoID = td.todoID;
      let todoValue = td.value;
      this.setState({
        todos: [...this.state.todos, {todoID: {todoID}, value: {todoValue}}]
      });
    });
  }  

  login = async (e) => {
    console.log(this.loginForm);
    if(this.validateLoginForm())
    {
      const response = await fetch('/api/Users/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.loginForm),
      })

      response.json().then(data => {
          console.log(data);
          if (data.status != 400) {
              this.setState({ userID: data.userID, XP: data.xp, Level: data.level });
              this.setState({ logged: true });
              this.getUserTodos();
          }
          else {
              this.errorMessage = "Check your nickname and password and try again";
              this.setState({ logged: false });
          }
      });  
      
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
            <input type="text"  className="input" name="Nickname" onChange={this.updateField}/>
            <br/>
            <p className="logPas">Password:</p>
            <input type="password" className="input" name="Password" onChange={this.updateField}/>
            <p>{this.errorMessage}</p>
            <button onClick = {this.login}>Log in</button>
            <button>Register</button>
        </div>
      )
    };

    if(this.state.logged)
    {
      todosView = (
          <div>
              {this.state.todos.map(td => <div>{td.value}</div>)}  
          </div>
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
