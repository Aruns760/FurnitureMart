// src/pages/EntryPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import './EntryPage.css';

const EntryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (role) => {
    setIsLoading(true);
    // Determine the path based on the role selected
    const path = role === 'admin' ? '/admin' : '/user';
    // Simulate a loading delay before navigation
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  return (
    <div className="entry-page">
      {isLoading && <Loader />}
      <div className="buttons-container">
        <button className="admin-btn" onClick={() => handleClick('admin')}>
          ADMIN
        </button>
        <button className="customer-btn" onClick={() => handleClick('customer')}>
          CUSTOMER
        </button>
      </div>
    </div>
  );
};

export default EntryPage;
