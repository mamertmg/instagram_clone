/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { getUserByUserId } from '../services/firebase';
import UserContext from '../context/user'

export default function useUser() {

  const [activeUser, setActiveUser] = useState({});
  const {user} = useContext(UserContext)

  const userId = user.uid

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId);
      setActiveUser(user);
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
}