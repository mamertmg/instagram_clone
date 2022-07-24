/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../context/firebase';

export default function useAuthListener() {

    const { auth } = useContext(FirebaseContext);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));

    useEffect(() => {
        const listener = auth.onAuthStateChanged(((authUser) => {
          if (authUser) {
            // we have a user...therefore we can store the user in localstorage
            localStorage.setItem('authUser', JSON.stringify(authUser));
            setUser(authUser);
          } else {
            // we don't have an authUser, therefore clear the localstorage
            localStorage.removeItem('authUser');
            setUser(null);
          }
        }));
    
        return () => listener();
      }, [auth]);

    return { user };
}