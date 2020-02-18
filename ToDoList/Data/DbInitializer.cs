using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Models;

namespace ToDoList.Data
{
    public class DbInitializer
    {
        public static void Initialize(TodoContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return;
            }

            var users = new User[]
            {
                new User{Nickname = "Kamilek", Password = "123"},
                new User{Nickname = "Gosia", Password = "12345"}
            };

            foreach (User u in users)
            {
                context.Users.Add(u);
            }
            context.SaveChanges();

            var todos = new Todo[]
            {
                new Todo{Value = "Wyniesc smieci", UserID = 1},
                new Todo{Value = "Wyniesc smiecidd", UserID = 1},
                new Todo{Value = "Wyniesc smieciss", UserID = 1},
                new Todo{Value = "Zjesc jablko", UserID = 2}
            };

            foreach (Todo todo in todos)
            {
                context.Todos.Add(todo);
            }
            context.SaveChanges();

        }
    }
}
