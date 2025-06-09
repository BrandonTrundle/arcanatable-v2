import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/General/AccountSettings.module.css";
import Navbar from "../Components/General/Navbar";

const AccountSettings = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Updating...");

    try {
      const res = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      updateUser({ username: data.username, email: data.email });
      setStatus("Account updated successfully.");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.mainroot}>
        <div className={styles.wrapper}>
          <h1>Account Settings</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />

            <button type="submit">Update Account</button>
          </form>
          {status && <p className={styles.status}>{status}</p>}
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
