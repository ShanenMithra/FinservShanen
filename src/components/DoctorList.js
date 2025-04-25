// DoctorList.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Fetch API only once
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ Filtering, searching, sorting (client side only)
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const sort = searchParams.get('sort') || '';

    let result = [...doctors];

    if (department) {
      result = result.filter(doc => doc.department.toLowerCase() === department.toLowerCase());
    }

    if (search) {
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredDoctors(result);
  }, [searchParams, doctors]);

  const handleChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div>
      <h1>Doctor List</h1>

      {/* UI Filters */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchParams.get('search') || ''}
        onChange={e => handleChange('search', e.target.value)}
      />

      <select
        value={searchParams.get('department') || ''}
        onChange={e => handleChange('department', e.target.value)}
      >
        <option value="">All Departments</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Neurology">Neurology</option>
        {/* Add more departments as needed */}
      </select>

      <select
        value={searchParams.get('sort') || ''}
        onChange={e => handleChange('sort', e.target.value)}
      >
        <option value="">No Sorting</option>
        <option value="asc">Name (A-Z)</option>
        <option value="desc">Name (Z-A)</option>
      </select>

      {/* Results */}
      <div>
        {filteredDoctors.map((doc, index) => (
          <div key={index}>
            <h3>{doc.name}</h3>
            <p>{doc.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
