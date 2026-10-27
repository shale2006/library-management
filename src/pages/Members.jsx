
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5001/api/members";

function Members() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [role, setRole] = useState("Member");
  const [contact, setContact] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load members from MySQL
  const loadMembers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load members");
      setMembers(await response.json());
    } catch (error) {
      console.error(error);
      alert("Could not load members. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const clearForm = () => {
    setName("");
    setMemberId("");
    setRole("Member");
    setContact("");
    setEditingId(null);
    setShowForm(false);
  };

  // Add or update a member in MySQL
  const saveMember = async (e) => {
    e.preventDefault();

    if (!name.trim() || !memberId.trim()) {
      alert("Please enter the member name and membership ID.");
      return;
    }

    const memberData = {
      name: name.trim(),
      memberId: memberId.trim(),
      contact: contact.trim(),
    };

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save member");
      }

      await loadMembers();
      clearForm();
      alert(editingId ? "Member updated successfully!" : "Member added successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not save member");
    }
  };

  const editMember = (member) => {
    setEditingId(member.id);
    setName(member.name || "");
    setMemberId(member.memberId || "");
    setContact(member.contact || "");
    setRole(member.role || "Member");
    setShowForm(true);
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not delete member");
      }

      await loadMembers();
      alert("Member deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not delete member");
    }
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
              required
            />

            <input
              type="text"
              placeholder="Membership ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Contact (optional)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
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

            <button type="button" onClick={clearForm}>
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
                <th>Contact</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading members...</td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="5">No members available.</td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.memberId}</td>
                    <td>{member.contact || "-"}</td>
                    <td>{member.role || "Member"}</td>
                    <td>
                      <button onClick={() => editMember(member)}>
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteMember(member.id)}
                      >
                        Delete
                      </button>
                    </td>
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
