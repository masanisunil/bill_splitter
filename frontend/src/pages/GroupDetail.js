import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function GroupDetail() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [memberName, setMemberName] = useState("");
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    paid_by: "",
  });
  const [summary, setSummary] = useState(null);
  const [settlements, setSettlements] = useState([]);

  const [expensesList, setExpensesList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load all data
  useEffect(() => {
    fetchGroup();
    fetchSummary();
    fetchSettlements();
    fetchExpensesList();
  }, []);

  const fetchGroup = async () => {
    const res = await API.get(`groups/${id}/`);
    setGroup(res.data);
  };

  const fetchSummary = async () => {
    const res = await API.get(`groups/${id}/summary/`);
    setSummary(res.data);
  };

  const fetchSettlements = async () => {
    const res = await API.get(`groups/${id}/settlement/`);
    setSettlements(res.data.settlements);
  };

  const fetchExpensesList = async () => {
    const res = await API.get(`groups/${id}/expenses/`);
    setExpensesList(res.data);
    setEditingId(null); // FIX: closes edit mode
  };

  // Add Member
  const addMember = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    await API.post("members/", { name: memberName, group: id });
    setMemberName("");

    fetchGroup();
    fetchSummary();
    fetchSettlements();
    fetchExpensesList();
  };

  // Add Expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!expense.title || !expense.amount || !expense.paid_by) return;

    await API.post("expenses/", {
      ...expense,
      group: id,
      amount: parseFloat(expense.amount),
    });

    setExpense({ title: "", amount: "", paid_by: "" });

    fetchGroup();
    fetchSummary();
    fetchSettlements();
    fetchExpensesList();
  };

  // Delete Expense
  const deleteExpense = async (expenseId) => {
    await API.delete(`expenses/${expenseId}/`);
    fetchExpensesList();
    fetchSummary();
    fetchSettlements();
  };

  // Update Expense
  const updateExpense = async (expenseId) => {
    await API.patch(`expenses/${expenseId}/`, {
      title: expense.title,
      amount: parseFloat(expense.amount),
      paid_by: expense.paid_by,
    });

    setEditingId(null);
    setExpense({ title: "", amount: "", paid_by: "" });

    fetchExpensesList();
    fetchSummary();
    fetchSettlements();
  };

  if (!group)
    return (
      <div className="p-10 text-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );

  const getMemberName = (id) => {
    return group.members.find((m) => m.id === id)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex justify-center transition">
      <div className="w-full max-w-4xl space-y-10">
        
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          💳 {group.name}
        </h1>

        {/* MEMBERS */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">👥 Members</h2>

          <ul className="mb-5 space-y-2">
            {group.members.map((m) => (
              <li key={m.id} className="text-lg">
                {m.name}{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  {/* (ID: {m.id}) */}
                </span>
              </li>
            ))}
          </ul>

          <form onSubmit={addMember} className="flex gap-3">
            <input
              className="flex-1 border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
              placeholder="Member name..."
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />
            <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg shadow">
              Add
            </button>
          </form>
        </div>

        {/* ADD EXPENSE */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">💰 Add Expense</h2>

          <form
            onSubmit={addExpense}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            <input
              className="border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"
              placeholder="Title"
              value={expense.title}
              onChange={(e) =>
                setExpense({ ...expense, title: e.target.value })
              }
            />

            <input
              className="border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) =>
                setExpense({ ...expense, amount: e.target.value })
              }
            />

            {/* PAID BY DROPDOWN */}
            <select
              className="border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"
              value={expense.paid_by}
              onChange={(e) =>
                setExpense({ ...expense, paid_by: e.target.value })
              }
            >
              <option value="">Paid by...</option>
              {group.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </form>

          <button
            onClick={addExpense}
            className="bg-blue-600 dark:bg-blue-500 text-white px-5 py-2 rounded-lg shadow"
          >
            Add Expense
          </button>
        </div>

        {/* EXPENSE LIST */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">🧾 All Expenses</h2>

          <ul className="space-y-4">
            {expensesList.map((exp) => (
              <li
                key={exp.id}
                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              >
                {editingId === exp.id ? (
                  // EDIT MODE
                  <div className="space-y-3">
                    <input
                      className="border dark:border-gray-600 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded w-full"
                      value={expense.title}
                      onChange={(e) =>
                        setExpense({ ...expense, title: e.target.value })
                      }
                    />

                    <input
                      className="border dark:border-gray-600 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded w-full"
                      value={expense.amount}
                      onChange={(e) =>
                        setExpense({ ...expense, amount: e.target.value })
                      }
                    />

                    {/* EDIT MODE DROPDOWN */}
                    <select
                      className="border dark:border-gray-600 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded w-full"
                      value={expense.paid_by}
                      onChange={(e) =>
                        setExpense({ ...expense, paid_by: e.target.value })
                      }
                    >
                      <option value="">Select Member</option>
                      {group.members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateExpense(exp.id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // NORMAL VIEW
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">{exp.title}</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        ₹{exp.amount} — paid by{" "}
                        <span className="font-semibold">
                          {getMemberName(exp.paid_by)}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(exp.id);
                          setExpense({
                            title: exp.title,
                            amount: exp.amount,
                            paid_by: exp.paid_by,
                          });
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* SUMMARY */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">📊 Summary</h2>

          {summary && (
            <>
              <div className="text-lg space-y-1 mb-5">
                <p>
                  <strong>Total:</strong> ₹{summary.total}
                </p>
                <p>
                  <strong>Per Person:</strong> ₹{summary.per_person}
                </p>
              </div>

              <table className="w-full border dark:border-gray-600 rounded-lg overflow-hidden">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 border dark:border-gray-600">Name</th>
                    <th className="p-2 border dark:border-gray-600">Paid</th>
                    <th className="p-2 border dark:border-gray-600">Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.balances.map((b) => (
                    <tr key={b.member_id} className="text-center">
                      <td className="p-2 border dark:border-gray-600">
                        {b.name}
                      </td>
                      <td className="p-2 border dark:border-gray-600">
                        ₹{b.paid}
                      </td>
                      <td
                        className={`p-2 border dark:border-gray-600 font-bold ${
                          b.balance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₹{b.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* SETTLEMENT */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">🤝 Settlement</h2>

          <ul className="space-y-3">
            {settlements.map((s, i) => (
              <li
                key={i}
                className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700 border dark:border-gray-600 text-lg"
              >
                <span className="font-semibold text-red-600">{s.from}</span>{" "}
                →
                <span className="font-semibold text-green-600"> {s.to}</span>{" "}
                must pay <span className="font-bold">₹{s.amount}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
