import "./App.css";
import React, { useState, useEffect } from 'react';
import { statesColRef, userCollectionRef } from "./firebase";
import { addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [states, setStates] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [editUser, setEditUser] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchStates = async () => {
    const querySnapshot = await getDocs(statesColRef);
    const stateList = querySnapshot.docs.map(doc => doc.data());
    setStates(stateList);
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(userCollectionRef);
    const userList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchStates();
  }, []);
  
  const addUser = async () => {
    if (newUser.trim() === '') return;

    await addDoc(userCollectionRef, {
      name: newUser,
    });
    setNewUser('');
    fetchUsers();
  };

  const updateUser = async () => {
    if (editUser.trim() === '' || editId === null) return;

    const userDocRef = doc(userCollectionRef, editId);
    await updateDoc(userDocRef, {
      name: editUser,
    });
    setEditUser('');
    setEditId(null);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const userDocRef = doc(userCollectionRef, id);
    await deleteDoc(userDocRef);
    fetchUsers();
  };

  return (
    <div>
      <h1>Social Network</h1>
      <div>
        <div>
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Enter user name"
          />
        </div>
        <div>
          <button onClick={addUser}>Add User</button>
        </div>
      </div>
      {editId && (
        <div>
          <div>
            <input
              type="text"
              value={editUser}
              onChange={(e) => setEditUser(e.target.value)}
              placeholder="Edit user name"
            />
          </div>
          <button onClick={updateUser}>Update User</button>
        </div>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}{' '}
            <button onClick={() => { setEditId(user.id); setEditUser(user.name); }}>
              Edit
            </button>{' '}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
