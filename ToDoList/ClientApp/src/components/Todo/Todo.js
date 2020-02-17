import React from 'react';

const todo = (props) => {
    return (
        <div>
        <ul>
        {props.Todos.map(todo => {
            return <li>{todo.value}</li>
        })}
        </ul>
        </div>
    )
}
export default todo;