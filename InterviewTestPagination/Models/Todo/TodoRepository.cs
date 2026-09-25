using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace InterviewTestPagination.Models.Todo {

    /// <summary>
    /// No need to use an actual persistent datasource. 
    /// All operations can be mocked in-memory as long as they are consistent with the chosen datasource implementation 
    /// (e.g. dont create new model instances when executing a search 'query', etc).
    /// TL;DR: from this point on Database-like operations can be mocked.
    /// </summary>
    public class TodoRepository : IModelRepository<Todo> {

        /// <summary>
        /// Example in-memory model datasource 'indexed' by id.
        /// </summary>
        private static readonly IDictionary<long, Todo> DataSource = new ConcurrentDictionary<long, Todo>();

        static TodoRepository() {
            // initializing datasource
            var startDate = DateTime.Today;
            for (var i = 1; i <= 55; i++) {
                var createdDate = startDate.AddDays(i);
                DataSource[i] = new Todo(id: i, task: "Dont forget to do " + i, createdDate: createdDate);
            }
        }

        public IEnumerable<Todo> All(int skip, int take, string ordenarPor, bool ordemCrescente)
        {

            IEnumerable<Todo> todos = DataSource.Values;

            if (ordenarPor == "id")
            {
                todos = ordemCrescente
                    ? todos.OrderBy(t => t.Id)
                    : todos.OrderByDescending(t => t.Id);
            }

            if (ordenarPor == "task")
            {
                todos = ordemCrescente
                    ? todos.OrderBy(t => t.Task)
                    : todos.OrderByDescending(t => t.Task);
            }

            if (ordenarPor == "createdDate")
            {
                todos = ordemCrescente
                    ? todos.OrderBy(t => t.CreatedDate)
                    : todos.OrderByDescending(t => t.CreatedDate);
            }

            return todos
          .Skip(skip)
          .Take(take);
        }
    }

}
