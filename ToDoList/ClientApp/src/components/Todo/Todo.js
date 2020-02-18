import React from 'react';

const todo = (props) => {
    return (
        <div>
        {props.Todos.map(todo => {
            return <p>{todo.value}</p>
        })}
        </div>
    )
}
export default todo;