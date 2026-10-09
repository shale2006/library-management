import { useState, useEffect } from "react";

function Members() {
  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem("members");
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [role, setRole] = useState("Member");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  const clearForm = () => {
    setName("");
    setMemberId("");
    setRole("Member");
    setEditingId(null);
    setShowForm(false);
  };

  const saveMember = (e) => {
    e.preventDefault();

    if (!name || !memberId || !role) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      setMembers(
        members.map((member) =>
          member.id === editingId
            ? {
                ...member,
                name,
                memberId,
                role,
              }
            : member
        )
      );
    } else {
      const newMember = {
        id: Date.now(),
        name,
        memberId,
        role,
      };

      setMembers([...members, newMember]);
    }

    clearForm();
  };

  return (
    <div className="page">

      <div className="library-header">
        <h1>Community Library</h1>
        <p>Library Management System</p>
      </div>

      <div className="members-card">

        <h2>Members</h2>

        <button
          className="add-member-button"
          onClick={() => setShowForm(!showForm)}
        >
          Add Member
        </button>

        {showForm && (
          <form className="member-form" onSubmit={saveMember}>

            <input
              type="text"
              placeholder="Member Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Membership ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit">
              {editingId ? "Update Member" : "Save Member"}
            </button>

            <button
              type="button"
              onClick={clearForm}
            >
              Cancel
            </button>

          </form>
        )}

        <div className="member-table-container">

          <table className="member-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>

              {members.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    No members available.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>

                    <td>{member.name}</td>
                    <td>{member.memberId}</td>
                    <td>{member.role}</td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Members;