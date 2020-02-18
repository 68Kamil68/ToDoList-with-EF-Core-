import React, { Component } from 'react';
import './Home.css';
import './Login/Login.css';

export class Home extends Component {
  static displayName = Home.name;
  state = {
    logged: false,
    userID: 0,
    todos: [],
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
  
  validateForm = () => {
    if (!this.loginForm.Nickname | !this.loginForm.Password)
    {
      this.error = true;
      this.errorMessage = 'Not all fields are filled';
      return false;
    }
      if (this.loginForm.Nickname.length > 20) {
          this.error = true;
          this.errorMessage = 'Login must be up to 20 characters';
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
        this.mapTodos(data);
      });
  }
    // TODO: fix mapping todos
  mapTodos = (todosData) => {
      todosData.forEach(td => {
      let todoID = td.todoID;
      let todoValue = td.value;
      this.setState({
          todos: [...this.state.todos, { todoID: todoID, value: todoValue}]
      });
    });
  }  

  login = async (e) => {
    console.log(this.loginForm);
    if(this.validateForm())
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
          if (data.status !== 400) {
              let xp = data.xp.toString().split('');
              this.setState({
                  userID: data.userID,
                  XP: xp.slice(-2).join(''),
                  Level: xp.slice(0, xp.length - 2).join('')
              });
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

  register = async (e) => {
      console.log(this.loginForm);
      if (this.validateForm()) {
          const response = await fetch('/api/Users/Register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.loginForm),
          })
      response.json().then(data => {
          console.log(data);
          if (data.status !== 400) {
              let xp = data.xp.toString().split('');
              this.setState({
                  userID: data.userID,
                  XP: xp.slice(-2).join(''),
                  Level: xp.slice(0, xp.length - 2).join('')
              });
              this.setState({ logged: true });
          }
          else {
              this.errorMessage = "Username arleady taken";
              this.setState({ logged: false });
          }
      });
    }
    else
    {
    this.setState({ logged: false });
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
            <button onClick= {this.register}>Register</button>
        </div>
      )
    };

    if(this.state.logged)
    {
      todosView = (
          <div>
              {this.state.todos.map(td => <div key={td.todoID}>{td.value}</div>)}  
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
