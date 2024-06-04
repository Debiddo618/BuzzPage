import { useState, useEffect } from 'react'
import './App.css'
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import HiveFeed from './components/HiveFeed/HiveFeed';
import NavBar from './components/NavBar/NavBar';
import PostForm from './components/PostForm/PostForm';
import { Routes, Route, useNavigate } from 'react-router-dom'

/*----------------User components-------------------- */
import UserPage from './components/UserPage/UserPage';
import UserForm from './components/UserForm/UserForm';
import PostDetails from './components/PostDetails/PostDetails';
import AllPosts from './components/AllPosts/AllPosts';

/*--------------------services--------------- */
import * as authService from './services/authService';
import * as postService from './services/postService';
import * as profileService from './services/profileService'

import NewsSlider from './components/NewsSlider/NewsSlider';

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [posts, setPosts] = useState([]);

  useEffect( () => {
    const fetchAllPosts = async () => {
      const postsData = await postService.index();
      setPosts(postsData)
    }
    if (user) fetchAllPosts();
  }, [user]); 
  
  const navigate = useNavigate();

  const handleSignout = () => {
    authService.signout();
    setUser(null);
    navigate('/users/signin');
  }
  const handleAddPost = async (postData) => {
    const newPost = await postService.create(postData)
    setPosts([...posts, newPost])
    navigate('/allposts')
  }

  const handleUpdateUser = async (userId,formData) => {
    const updatedUser = await profileService.update(userId, formData);
    setUser(updatedUser);
    navigate(`/users/profile/${userId}`);
  }

  const handleDeleteUser = async (userId) => {
    const deletedUser = await profileService.deleteUser(userId);
    handleSignout()
  }
 
  return (
    <>
      <NavBar user={user} handleSignout={handleSignout} />
      <Routes>
        <Route path="/" element={<HiveFeed />} />
        <Route path="/news" element={<NewsSlider />} />
        <Route path="/users/signup" element={<SignUpForm setUser={setUser} />} />
        <Route path="/users/signin" element={<SignInForm setUser={setUser} />} />
        <Route path="/users/profile/:userId" element={<UserPage />} />
        <Route path="/users/:userId/posts/new" element={<PostForm handleAddPost={handleAddPost} />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/allposts" element={<AllPosts AllPosts={posts} />} />
      </Routes>
    </>

  )
};

export default App;