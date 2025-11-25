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
    <div className="min-h-screen flex justify-center p-8 bg-gray-100 dark:bg-gray-900 transition">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          💸 Split Bill Groups
        </h1>

        {/* Create Group */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Create New Group
          </h2>

          <form onSubmit={createGroup} className="flex gap-3">
            <input
              className="flex-1 border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
              placeholder="Enter group name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className="bg-blue-600 dark:bg-blue-500 text-white px-5 py-2 rounded-lg shadow">
              Create
            </button>
          </form>
        </div>

        {/* Group List */}
        <div className="space-y-4">
          {groups.map((g) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}   // ✅ correct route
              className="block bg-white dark:bg-gray-800 rounded-xl shadow p-5 border dark:border-gray-700"
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
