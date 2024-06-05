import { useState, useEffect, createContext } from 'react'
import './App.css'
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import HiveFeed from './components/HiveFeed/HiveFeed';
import NavBar from './components/NavBar/NavBar';
import PostForm from './components/PostForm/PostForm';

import { Routes, Route, useNavigate } from 'react-router-dom'
import PageTransition from './components/PageTransition/PageTransition';
import Comment from './components/Comment/Comment';


/*----------------User components-------------------- */
import UserPage from './components/UserPage/UserPage';
import UserForm from './components/UserForm/UserForm';
/*----------------Post components-------------------- */
import PostDetails from './components/PostDetails/PostDetails';
import AllPosts from './components/AllPosts/AllPosts';

/*--------------------services--------------- */
import * as authService from './services/authService';
import * as postService from './services/postService';
import * as profileService from './services/profileService'

import NewsSlider from './components/NewsSlider/NewsSlider';

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [posts, setPosts] = useState([]);


  
  useEffect(() => {
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
    navigate('/')
  }

  const handleUpdateUser = async (userId, formData) => {
    const updatedUser = await profileService.update(userId, formData);
    setUser(updatedUser);
    navigate(`/users/profile/${userId}`);
  }

  const handleDeleteUser = async (userId) => {
    const deletedUser = await profileService.deleteUser(userId);
    handleSignout()
  }
  const handleDeletePost = async (postId) => {
    try {
      const deletedPost = await postService.deletePost(postId);
      setPosts(posts.filter(post => post._id !== deletedPost._id))
      navigate('/'); // Navigate to the home page after deleting
    } catch (error) {
      console.error('Failed to delete post', error);
    }
    navigate(`/`)
  }


  return (
    <AuthedUserContext.Provider value={user}>
      <NavBar user={user} handleSignout={handleSignout} posts={posts} />
      <Routes>
        <Route path="/" element={<HiveFeed AllPosts={posts} />} />
        <Route path="/comment" element={<Comment />} />
        <Route path="/users/signup" element={<SignUpForm setUser={setUser} />} />
        <Route path="/users/signin" element={<SignInForm setUser={setUser} />} />
        <Route path="/users/profile/:userId" element={<UserPage posts={posts} user={user} handleDeleteUser={handleDeleteUser} />} />
        <Route path="/users/:userId/posts/new" element={<PostForm handleAddPost={handleAddPost} />} />
        <Route path="/posts/:postId" element={<PostDetails handleDeletePost={handleDeletePost} />} />
        <Route path="/users/profile/:userId/edit" element={<UserForm handleUpdateUser={handleUpdateUser} user={user} />} />
      </Routes>
    </AuthedUserContext.Provider>

  )
};

export default App;