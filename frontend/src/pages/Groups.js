import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await API.get("groups/");
    setGroups(res.data);
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await API.post("groups/", { name });
    setName("");
    fetchGroups();
  };

  return (
    <div className="min-h-screen fade-in flex justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl space-y-8">

        <h1 className="text-4xl slide-up font-bold text-center text-gray-900 dark:text-white">
          💸 Split Bill Groups
        </h1>

        {/* Create Group */}
        <div className="bg-white card-pop dark:bg-gray-800 rounded-xl shadow p-6 border dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Create New Group
          </h2>

          <form
            onSubmit={createGroup}
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <input
              className="flex-1 border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-sm"
              placeholder="Enter group name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className="w-full sm:w-auto bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg shadow">
              Create
            </button>
          </form>
        </div>

        {/* Group list */}
        <div className="space-y-4">
          {groups.map((g, index) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}
              className="block card-pop bg-white dark:bg-gray-800 rounded-xl shadow p-5 border dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <h3 className="text-xl font-semibold dark:text-white">{g.name}</h3>
            </Link>
          ))}

          {groups.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No groups yet
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
