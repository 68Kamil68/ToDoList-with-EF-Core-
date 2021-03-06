import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPen } from '@fortawesome/free-solid-svg-icons'
import './Home.css';
import './Login.css';
import './Todos.css';

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

  getUserTodos = async () => {
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

    mapTodos = (todosData) => {
      this.setState({ todos: [] });

      todosData.forEach(td => {
      let todoID = td.todoID;
      let todoValue = td.value;
      let todoDeleted = td.deleted;
      this.setState({
          todos: [...this.state.todos, { todoID: todoID, value: todoValue, deleted: todoDeleted}]
      });
    });
  }  

  login = async (e) => {
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
              this.errorMessage = "Check your credentials";
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

  deleteTodo = async (todoID) => {
      await fetch(`/api/Todos/${todoID}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          }
      });
      this.getUserTodos();
  }

  addTodo = async () => {
      let todoToAdd = {
          userID: this.state.userID,
          value: document.getElementById("todoToAdd").value
      };
      await fetch("/api/Todos/", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(todoToAdd)
      });
      this.getUserTodos();
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
              <br />
              <p className="errorMsg">{this.errorMessage}</p>
            <button className="logBtn" onClick={() => this.register()}>Register</button>
            <button className="logBtn" onClick={() => this.login()}>Log in</button>
        </div>
      )
    };

    if(this.state.logged)
    {
      todosView = (
          <div className="todos">
              <input type="text" id="todoToAdd" className="todoInput" placeholder="todo to add..." />
              <button onClick={() => this.addTodo()} className="btn"><FontAwesomeIcon icon={faPen} size="xl"/></button>
              {this.state.todos.filter(td => td.deleted !== true).map(td =>
                  <div className="singleTodo" key={td.todoID}>
                  <h6 className="todoText">{td.value}</h6>
                  <button onClick={() => this.deleteTodo(td.todoID)} className="btn"><FontAwesomeIcon icon={faTrashAlt} size="xl"/></button>
              </div>)}  
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
