using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDoList.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }
        [Required][MaxLength(20)]
        public string Nickname { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public int XP { get; set; } = 0;
        public ICollection<Todo> Todos { get; set; }
    }
}
