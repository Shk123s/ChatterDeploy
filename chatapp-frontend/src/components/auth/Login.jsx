import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { host } from '../../utils/host';
import Cookies from 'js-cookie';

const Login = () => {
  const userNameRef = useRef();
  const passwordRef = useRef();
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
 
      const response = await axios.post(`${host}/api/login`, {
        username: userName,
        password: password,
      },{
        withCredentials: true,
      });

      if (response.status === 200) {
         Cookies.set('token', response.data.token, { expires: 1, secure: false });
         Cookies.set('userDetails', JSON.stringify(response.data.userDetails));
        // // console.log(response.data.userDetails);
        // Cookies.set('userDetails', response.data.userDetails, { expires: 1, secure: false });


      
        navigate('/chats');
        window.location.reload();
      }
    } catch (error) {
       console.log(error)
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='loginContainer'>
      <div className='loginbox' style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>

        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Username:</label>
            <input
              type="text"
              ref={userNameRef}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              ref={passwordRef}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#56c0da', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
