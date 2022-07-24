import { db, FieldValue } from '../lib/firebase';
import { collection, doc, query, where, getDocs, updateDoc} from "firebase/firestore"; 

export async function doesUsernameExist(username) {
  const colRef = collection(db, "users");
  const q = query(colRef, where('username', '==', username.toLowerCase()))

  const querySnapshot = await getDocs(q);

  return querySnapshot.size
}

export async function getUserByUsername(username) {

  const colRef = collection(db, "users");
  const q = query(colRef, where('username', '==', username.toLowerCase()))

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {

  const colRef = collection(db, "users");
  const q = query(colRef, where('userId', '==', userId))

  const querySnapshot = await getDocs(q);

  const user = querySnapshot.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return user;
}

// check all conditions before limit results
export async function getSuggestedProfiles(userId, following) {
  
  const colRef = collection(db, "users");
  let q = ""

  if (following.length > 0) {
     q = query(colRef, where('userId', 'not-in', [...following, userId]));
  } else {
    q = query(colRef, where('userId', '!=', userId));
  }
  const querySnapshot = await getDocs(q);

  console.log(querySnapshot)

  const profiles = querySnapshot.docs.map((user) => ({
    ...user.data(),
    docId: user.id
  }));

  return profiles;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id (karl's profile)
  profileId, // the user that karl requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {

  const docRef = doc(db, "users",loggedInUserDocId);

  updateDoc(docRef, {
      following: isFollowingProfile ?
        FieldValue.arrayRemove(profileId) :
        FieldValue.arrayUnion(profileId)
  });

    return
}

export async function updateFollowedUserFollowers(
  profileDocId, // currently logged in user document id (karl's profile)
  loggedInUserDocId, // the user that karl requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {

  const docRef = doc(db, "users",profileDocId);

  updateDoc(docRef, {
    following: isFollowingProfile ?
      FieldValue.arrayRemove(loggedInUserDocId) :
      FieldValue.arrayUnion(loggedInUserDocId)
  });

  return 
}

export async function getPhotos(userId, following) {
  // [5,4,2] => following

  const colRef = collection(db, "photos");
  const q = query(colRef, where('userId', 'in', following))

  const querySnapshot = await getDocs(q);

  const userFollowedPhotos = querySnapshot.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {

  const colRef = collection(db, "users");
  const q = query(colRef, where('username', '==', userId))

  const querySnapshot = await getDocs(q);

  const photos = querySnapshot.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));
  return photos;
}

export async function isUserFollowingProfile(loggedInUserUsername, profileUserId) {
  const result = await db
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUserUsername) // karl (active logged in user)
    .where('following', 'array-contains', profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}