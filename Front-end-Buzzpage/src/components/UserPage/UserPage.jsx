import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { show } from '../../services/profileService';

import styles from './UserPage.module.css'
import SideBar from '../SideBar/SideBar';

const dummyData = [
    {
        "title": "Scraping dog poop in the garage",
        "text": "with my bare hand and putty knife and no gloves",
        "image": "poop image",
        "category": "News"
    },
    {
        "title": "Feeding two puppies",
        "text": "always fighting for foods",
        "image": "food image",
        "category": "News"
    },
    {
        "title": "Going out for walk late at night",
        "text": "picking up poop on the street",
        "image": "poop image",
        "category": "News"
    },
    {
        "title": "Getting the puppies to sit",
        "text": "getting closer to the goal using treats",
        "image": "puppy image",
        "category": "News"
    },
    {
        "title": "Getting the puppies to sit",
        "text": "getting closer to the goal using treats",
        "image": "puppy image",
        "category": "News"
    },
    {
        "title": "Getting the puppies to sit",
        "text": "getting closer to the goal using treats",
        "image": "puppy image",
        "category": "News"
    }
];


const UserPage = (props) => {
    //gets users id
    const { userId } = useParams()
    const [user, setUser] = useState(null)

    const [dummyPost, setDummyPost] = useState(dummyData);

    //gets the current users data 
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await show(userId)
            setUser(userData.user);
        }
        fetchUser();
    }, []);

    //show loading until its gets user
    if (!user) return <h1>Loading User</h1>;


    return (  
        <main className={styles.container}>

                <div className={styles.sidebar}> 
                    <SideBar dummyPost={dummyPost}/>
                </div>

                    <div className={styles.userInfo}>
                        <img src={user.image}  alt='...'/>
                        <h4 >{user.username}</h4>
                    </div>
                    <div className={styles.userBio}>
                        <div className="card">
                            <h5>name: {user.firstName} {user.lastName}</h5>
                            <p className="card-text">bio: {user.bio}</p>
                            <button><Link to={`/users/profile/${userId}/edit`} style={{ textDecoration: 'none', color: 'black' }}>Edit</Link></button>
                            <button onClick={() => props.handleDeleteUser(userId)}>Delete</button>
                        </div>
                    </div>
             

                <div className={styles.userPost}>
                    {user.posts.length === 0 ? 'no posts': user.posts.map((post) =>(
                        <div className={styles.post} key={post._id}>
                            <div className="card" >
                                <div>
                                <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none' }}><h4>{post.title}</h4></Link>
                                    <h6>{post.category}</h6>
                                </div>
                                <p>{post.text}</p>
                                {!post.image ? '': <img src={post.image} className="card-img" alt='...'/>}
                                {!post.like ? '' : <h6>likes: {post.like}</h6>}
                            </div>
                        </div>
                    ))}
                </div>
        </main>
     );

}

export default UserPage;