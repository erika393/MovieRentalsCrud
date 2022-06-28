using MovieCrudAPI.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieCrudAPI.Services
{
    public interface IMovieCrudService<T>
    {
        Task<IEnumerable<T>> GetObjects();
        Task<T> GetObject(int id);
        Task<IEnumerable<T>> GetObjectByName(string name);
        Task Create(T obj);
        Task Update(T obj);
        Task Delete(T obj);
    }
}
