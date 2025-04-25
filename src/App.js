
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DoctorList from './components/DoctorList'; 

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DoctorList />} />
      </Routes>
    </div>
  );
};

export default App;
