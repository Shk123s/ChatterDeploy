import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./signup.css";
import { host } from '../../utils/host';

const Signup = () => {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const [bio, setBio] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const clearError = () => setErrorMessage('');
    const userInput = userNameRef.current;
    const passwordInput = passwordRef.current;

    userInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);

    return () => {
      userInput.removeEventListener('input', clearError);
      passwordInput.removeEventListener('input', clearError);
    };
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        `${host}/api/addUser`,
        {
          username: userName,
          password: password,
          bio: bio, 
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='signupContainer'>
      <div
        className='loginbox'
        style={{
          maxWidth: '300px',
          margin: 'auto',
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Signup</h2>

        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Username:</label>
            <input
              type="text"
              ref={userNameRef}
              required
              style={{
                width: '100%',
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              ref={passwordRef}
              required
              style={{
                width: '100%',
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '8px',
                margin: '5px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#56c0da',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:'pointer'
            }}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
