using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDoList.Models
{
    public class Todo
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TodoID { get; set; }
        [Required]
        public string Value { get; set; }
        [Required]
        public bool Deleted { get; set; } = false;
        public User User { get; set; }
    }
}
