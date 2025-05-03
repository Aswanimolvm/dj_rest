import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/items/';

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9fc',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  input: {
    padding: '10px',
    width: '45%',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
  },
  li: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '6px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  smallInput: {
    padding: '8px',
    border: '1px solid #bbb',
    borderRadius: '4px',
    marginRight: '5px',
    marginBottom: '5px',
  },
  smallButton: {
    padding: '6px 10px',
    marginRight: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get(API_URL).then(res => setItems(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL, newItem).then(res => {
      setItems([...items, res.data]);
      setNewItem({ name: '', description: '' });
    });
  };

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditingData({ name: item.name, description: item.description });
  };

  const handleUpdate = (id) => {
    axios.put(`${API_URL}${id}/`, editingData).then(res => {
      setItems(items.map(item => (item.id === id ? res.data : item)));
      setEditingItemId(null);
      setEditingData({ name: '', description: '' });
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}${id}/`).then(() => {
      setItems(items.filter(item => item.id !== id));
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Items</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Item</button>
      </form>

      <ul style={styles.ul}>
        {items.map(item => (
          <li key={item.id} style={styles.li}>
            {editingItemId === item.id ? (
              <>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                  style={styles.smallInput}
                />
                <input
                  type="text"
                  value={editingData.description}
                  onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                  style={styles.smallInput}
                />
                <button
                  onClick={() => handleUpdate(item.id)}
                  style={{ ...styles.smallButton, ...styles.editButton }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingItemId(null)}
                  style={{ ...styles.smallButton, backgroundColor: '#6c757d', color: 'white' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div>
                  <strong>{item.name}</strong>: {item.description}
                </div>
                <div>
                  <button
                    onClick={() => startEdit(item)}
                    style={{ ...styles.smallButton, ...styles.editButton }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ ...styles.smallButton, ...styles.deleteButton }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
