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
    setEditingId(null);
  };

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

  const deleteExpense = async (expenseId) => {
    await API.delete(`expenses/${expenseId}/`);
    fetchExpensesList();
    fetchSummary();
    fetchSettlements();
  };

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
      <div className="p-10 text-center text-gray-400 dark:text-gray-300">
        Loading...
      </div>
    );

  const getMemberName = (id) => {
    return group.members.find((m) => m.id === id)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen fade-in bg-gray-100 dark:bg-gray-900 px-4 py-6 sm:px-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-10">

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center dark:text-white slide-up">
          💳 {group.name}
        </h1>

        {/* MEMBERS */}
        <div className="bg-white card-pop dark:bg-gray-800 shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            👥 Members
          </h2>

          <ul className="mb-5 space-y-2">
            {group.members.map((m, i) => (
              <li
                key={m.id}
                className="text-lg dark:text-white slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {m.name}
              </li>
            ))}
          </ul>

          <form
            onSubmit={addMember}
            className="flex flex-col sm:flex-row w-full gap-3"
          >
            <input
              className="flex-1 border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 px-4 py-2 rounded-lg dark:text-white"
              placeholder="Member name..."
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />

            <button className="w-full sm:w-auto bg-green-600 dark:bg-green-500 text-white px-6 py-2 rounded-lg">
              Add
            </button>
          </form>
        </div>

        {/* ADD EXPENSE */}
        <div className="bg-white card-pop dark:bg-gray-800 shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            💰 Add Expense
          </h2>

          <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              className="border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 px-4 py-2 rounded-lg"
              placeholder="Title"
              value={expense.title}
              onChange={(e) =>
                setExpense({ ...expense, title: e.target.value })
              }
            />

            <input
              className="border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 px-4 py-2 rounded-lg"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) =>
                setExpense({ ...expense, amount: e.target.value })
              }
            />

            <select
              className="border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 px-4 py-2 rounded-lg"
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
            className="mt-4 w-full sm:w-auto bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg slide-up"
          >
            Add Expense
          </button>
        </div>

        {/* EXPENSE LIST */}
        <div className="bg-white card-pop dark:bg-gray-800 shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            🧾 All Expenses
          </h2>

          <div className="space-y-4">
            {expensesList.map((exp, i) => (
              <div
                key={exp.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl slide-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {editingId === exp.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full border px-3 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:border-gray-500"
                      value={expense.title}
                      onChange={(e) =>
                        setExpense({ ...expense, title: e.target.value })
                      }
                    />

                    <input
                      className="w-full border px-3 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:border-gray-500"
                      value={expense.amount}
                      onChange={(e) =>
                        setExpense({ ...expense, amount: e.target.value })
                      }
                    />

                    <select
                      className="w-full border px-3 py-2 rounded bg-gray-200 dark:bg-gray-600 dark:border-gray-500"
                      value={expense.paid_by}
                      onChange={(e) =>
                        setExpense({ ...expense, paid_by: e.target.value })
                      }
                    >
                      <option>Select member</option>
                      {group.members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateExpense(exp.id)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="w-full sm:w-auto bg-gray-500 text-white px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-lg font-semibold dark:text-white">
                        {exp.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        ₹{exp.amount} — paid by{" "}
                        <span className="font-semibold">
                          {getMemberName(exp.paid_by)}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setEditingId(exp.id);
                          setExpense({
                            title: exp.title,
                            amount: exp.amount,
                            paid_by: exp.paid_by,
                          });
                        }}
                        className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="w-full sm:w-auto bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white card-pop dark:bg-gray-800 shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            📊 Summary
          </h2>

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

              <div className="overflow-x-auto">
                <table className="w-full border dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Paid</th>
                      <th className="p-2">Balance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.balances.map((b) => (
                      <tr key={b.member_id} className="text-center dark:text-white">
                        <td className="p-2">{b.name}</td>
                        <td className="p-2">₹{b.paid}</td>
                        <td
                          className={`p-2 font-bold ${
                            b.balance >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ₹{b.balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* SETTLEMENT */}
        <div className="bg-white card-pop dark:bg-gray-800 shadow rounded-xl p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            🤝 Settlement
          </h2>

          <ul className="space-y-3">
            {settlements.map((s, i) => (
              <li
                key={i}
                className="p-4 rounded-lg slide-up bg-blue-50 dark:bg-gray-700 border dark:border-gray-600 text-lg"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <span className="font-semibold text-red-600">{s.from}</span>{" "}
                →{" "}
                <span className="font-semibold text-green-600">{s.to}</span>{" "}
                must pay <span className="font-bold">₹{s.amount}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
