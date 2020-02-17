import React, { Component } from 'react';
import Login from './Login/Login';
import Todo from './Todo/Todo'
import './Home.css';

export class Home extends Component {
  static displayName = Home.name;
  state = {
    logged: false,
    userID: 0,
    todos: [{value: 'kokok'}, {value:'kokos'}]
  }

  login = () => {
    
    this.setState({logged: true});
  }

  render () {
    return (
        <div className="Home">
            {this.state.logged ? <Todo Todos = {this.state.todos} /> : <Login clicked = {this.login}
            />}
      </div>
    );
  }
}
