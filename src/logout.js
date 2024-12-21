import React, {useEffect} from 'react';
import { redirect, useNavigate } from "react-router-dom";

import { auth } from './firebaseConfig';

const Logout = () => {
  const navigate = useNavigate();
  const logout = () => {
		auth.signOut();
		localStorage.removeItem('user');
    localStorage.removeItem('afFirebaseIdToken');
		// return redirect('/en/login');
		navigate("/login");
	}

  useEffect(() => {
    logout();
  }, [])
}

export default Logout;
