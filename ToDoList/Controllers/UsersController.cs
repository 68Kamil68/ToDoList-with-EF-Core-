using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ToDoList.Data;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly TodoContext _context;

        public UsersController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/Users
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Route("Register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (_context.Users.Any(u => u.Nickname == user.Nickname))
            {
                return BadRequest();
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var logged = await Login(new LoginModel { Nickname = user.Nickname, Password = user.Password });

            return logged;
        }

        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult<User>> Login([FromBody]LoginModel user)
        {
            var userInDB = await _context.Users.FirstOrDefaultAsync(u => u.Nickname == user.Nickname);
            if (userInDB == null)
            {
                return BadRequest();
            }

            if (userInDB.Password != user.Password)
            {
                return BadRequest();
            }

            var key = Encoding.ASCII.GetBytes
                        ("YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv");
            var JWToken = new JwtSecurityToken(
                issuer: "https://localhost:44346/",
                audience: "https://localhost:44346/",
                notBefore: new DateTimeOffset(DateTime.Now).DateTime,
                expires: new DateTimeOffset(DateTime.Now.AddDays(1)).DateTime,
                signingCredentials: new SigningCredentials(
                                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) 
                );
            var token = new JwtSecurityTokenHandler().WriteToken(JWToken);
            //HttpContext.Session.SetString("JWToken", token);

            return userInDB;
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserID == id);
        }
    }
}
