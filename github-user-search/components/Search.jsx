import React, { useState } from 'react';
import { fetchUsers } from '../services/githubService';

function Search() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [minRepos, setMinRepos] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setUsers([]);
    try {
      const data = await fetchUsers({ username, location, minRepos, page: 1 });
      setUsers(data.items);
      setTotalCount(data.total_count);
      setPage(1);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const data = await fetchUsers({ username, location, minRepos, page: nextPage });
      setUsers((prev) => [...prev, ...data.items]);
      setPage(nextPage);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <input
          type="number"
          min="0"
          value={minRepos}
          onChange={(e) => setMinRepos(e.target.value)}
          placeholder="Minimum repositories"
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
      </form>
      <div className="results">
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">Looks like we cant find the user</p>}
        {users.length > 0 && !loading && !error && (
          <div>
            <p className="mb-2">Showing {users.length} of {totalCount} users</p>
            <ul className="grid gap-4">
              {users.map((user) => (
                <li key={user.id} className="flex items-center bg-gray-100 p-4 rounded shadow">
                  <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h2 className="font-bold text-lg">{user.login}</h2>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Profile</a>
                  </div>
                </li>
              ))}
            </ul>
            {users.length < totalCount && (
              <button onClick={handleLoadMore} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Load More</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
