import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

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

  const updateGroup = async (id) => {
    if (!editName.trim()) return;

    await API.patch(`groups/${id}/`, { name: editName });
    setEditingId(null);
    fetchGroups();
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    await API.delete(`groups/${id}/`);
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
            Create New Group (Trip)
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
            <div
              key={g.id}
              className="card-pop bg-white dark:bg-gray-800 rounded-xl shadow p-5 border dark:border-gray-700"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              {editingId === g.id ? (
                // EDIT MODE
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    className="flex-1 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <button
                    onClick={() => updateGroup(g.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // NORMAL VIEW
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

                  {/* Navigate to group */}
                  <Link to={`/groups/${g.id}`} className="block w-full">
                    <h3 className="text-xl font-semibold dark:text-white">
                      {g.name}
                    </h3>
                  </Link>

                  {/* Edit + Delete */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setEditingId(g.id);
                        setEditName(g.name);
                      }}
                      className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteGroup(g.id)}
                      className="w-full sm:w-auto bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              )}
            </div>
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
