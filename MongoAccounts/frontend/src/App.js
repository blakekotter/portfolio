import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/register';
import AccountSummary from './components/account_summary';
import AccountBalance from './components/account_balance';
import Login from './components/login';
import Logout from './components/logout';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account_summary" element={<AccountSummary />} />
        <Route path="/account_balance" element={<AccountBalance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default App;
