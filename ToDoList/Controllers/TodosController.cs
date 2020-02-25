using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoList.Data;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodosController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/Todos/
        [HttpGet]
        [Route("GetUserTodos")]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodosOfUser(int userID)
        {
            if(HttpContext.Session.GetString("JWToken") == null)
            {
                return BadRequest();
            }
            
            return await _context.Todos.Where(td => td.UserID == userID).ToListAsync();
        }

        // POST: api/Todos
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Todo>> PostTodo(Todo todo)
        {
            if (HttpContext.Session.GetString("JWToken") == null)
            {
                return BadRequest();
            }

            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTodo", new { id = todo.TodoID }, todo);
        }

        // DELETE: api/Todos/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Todo>> DeleteTodo(int id)
        {
            if (HttpContext.Session.GetString("JWToken") == null)
            {
                return BadRequest();
            }

            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            todo.Deleted = true;
            await _context.SaveChangesAsync();

            return todo;
        }

    }
}
