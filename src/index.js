import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import FirebaseContext from './context/firebase';
import {db, FieldValue, auth} from './lib/firebase'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{db, FieldValue, auth}}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>
);