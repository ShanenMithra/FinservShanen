import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Autocomplete, TextField } from '@mui/material';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortOption, setSortOption] = useState('');

  // Fetching the doctor data
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error(err));
  }, []);

  // Filtering logic (can be updated for search, sort, etc.)
  useEffect(() => {
    let result = [...doctors];

    // Search by doctor name
    if (search) {
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by consultation type
    if (consultationType) {
      result = result.filter(doc => doc.consultationType === consultationType);
    }

    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      result = result.filter(doc =>
        selectedSpecialties.some(specialty => doc.specialties.includes(specialty))
      );
    }

    // Sort by fees or experience
    if (sortOption === 'fees') {
      result.sort((a, b) => a.fee - b.fee);
    } else if (sortOption === 'experience') {
      result.sort((a, b) => b.experience - a.experience);
    }

    setFilteredDoctors(result);
  }, [search, consultationType, selectedSpecialties, sortOption, doctors]);

  const handleSpecialtyChange = (e) => {
    const value = e.target.value;
    setSelectedSpecialties(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleSearchChange = (key, value) => {
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

      {/* Autocomplete Search Bar */}
      <Autocomplete
        value={search}
        onChange={(e, newValue) => setSearch(newValue)}
        options={doctors.map(doc => doc.name)}
        renderInput={(params) => <TextField {...params} label="Search by name" />}
      />

      {/* Filter Panel */}
      <div>
        {/* Consultation Type */}
        <select onChange={(e) => setConsultationType(e.target.value)} value={consultationType}>
          <option value="">Select Consultation Type</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        {/* Specialties */}
        <div>
          <label>Select Specialties:</label>
          <select multiple onChange={handleSpecialtyChange}>
            <option value="Dentist">Dentist</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
            {/* Add more specialties as needed */}
          </select>
        </div>

        {/* Sort By */}
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort by</option>
          <option value="fees">Fees</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      {/* Doctor Details Display */}
      <div>
        {filteredDoctors.map((doc, index) => (
          <div key={index}>
            {/* Doctor's Photo */}
            <img src={doc.photo} alt={doc.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            
            <h3>{doc.name}</h3>
            <p><strong>Introduction:</strong> {doc.doctor_introduction}</p>
            <p><strong>Specialties:</strong> {doc.specialities.map(sp => sp.name).join(', ')}</p>
            <p><strong>Fees:</strong> {doc.fees}</p>
            <p><strong>Experience:</strong> {doc.experience}</p>
            <p><strong>Languages:</strong> {doc.languages.join(', ')}</p>
            <p><strong>Clinic:</strong> {doc.clinic.name}, {doc.clinic.address.city}</p>

            {/* Clinic Logo */}
            <img src={doc.clinic.logo_url} alt={`${doc.clinic.name} Logo`} style={{ width: '50px', height: '50px' }} />

            {/* Consultations */}
            <p>{doc.video_consult ? 'Video Consultation Available' : 'No Video Consultation'}</p>
            <p>{doc.in_clinic ? 'In-Clinic Consultation Available' : 'No In-Clinic Consultation'}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
