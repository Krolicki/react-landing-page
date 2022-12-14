import useAuth from "../hooks/useAuth"
import { Link, useOutletContext, useParams } from "react-router-dom"
import "./styles/Profile.css"
import './styles/Posts.css'
import { useEffect, useState } from "react"
import { Loader, Pagination } from "../components"
import { FiArrowLeft } from "react-icons/fi"

export const Profile = () => {
    //const {auth} = useAuth()
    const {username} = useParams()
    const uid = useOutletContext()
    const [loading, setLoading] = useState(true)

    const [allUserPosts, setAllUserPosts] = useState()
    const [currentPage, setCurentPage] = useState(1)

    const [totalPosts, setTotalPosts] = useState(0)
    const [lastPost, setLastPost] = useState(null)
    const [bestPost, setBestPost] = useState(null)
    const [totalViews, setTottalViews] = useState()

    const [userProfile, setUserProfile] = useState(null)

    const [showAllPosts, setShowAllPosts] = useState(false)

    useEffect(()=>{
        const getUserProfile = async () => {
            setLoading(true)
            const postsFromAPI = await fetch(`https://react-workshop-eba4b-default-rtdb.europe-west1.firebasedatabase.app/posts.json?orderBy=%22user%22&equalTo=%22${username}%22&auth=${uid}`)
                .then(response => {
                    if (response.ok)
                        return response.json()
                    throw response
                })
                .then(response=>{
                    return Object.values(response)
                })
                .catch((err) => {
                    console.log(err)
                })
                const userProfileFromAPI = await fetch(`https://react-workshop-eba4b-default-rtdb.europe-west1.firebasedatabase.app/users/${username.toLowerCase()}.json?auth=${uid}`)
                .then(response => {
                    if (response.ok)
                        return response.json()
                    throw response
                })
                .catch((err) => {
                    console.log(err)
                })
                setUserProfile(userProfileFromAPI)
                setAllUserPosts(postsFromAPI)
                let total = postsFromAPI.length
                setTotalPosts(total)
                setLastPost(postsFromAPI[total - 1])
                let mostViews = Number.MIN_VALUE
                let tempBestPost = null
                let sumTotalViews = 0
                postsFromAPI.forEach(post => { 
                    sumTotalViews += post.views
                     if(post.views > mostViews){
                        tempBestPost = post
                        mostViews = post.views
                     }
                })
                setBestPost(tempBestPost)
                setTottalViews(sumTotalViews)
                setLoading(false)
        }
        getUserProfile()
        window.scrollTo(0, 0)
    },[username])

    if (loading) {
        return <Loader title={`Loading profile...`} />
    }

    if(showAllPosts){
        const indexLastPost = currentPage * 5
        const indexFirstPost = indexLastPost - 5
        const currentPosts = allUserPosts.slice(indexFirstPost, indexLastPost)
    
        const paginate = (num) => setCurentPage(num)
        return(
            <div className='posts-wraper' id="posts-top">
                <section className='posts-container'>
                    <Pagination
                        postsPerPage={5} 
                        totalPosts={allUserPosts.length} 
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                    <span className="profile-allposts-buttons">
                        <span className="profile-back" onClick={()=>setShowAllPosts(false)}>
                            <FiArrowLeft size={25} /><p>Back to profile</p>
                        </span>
                        {/* <Link to="/newpost"><button className="profile-button">New Post</button></Link> */}
                    </span>
                    <h1 className="profile-allposts-title">{username} posts ({totalPosts})</h1>
                    <section className='posts'>
                        {currentPosts.map(post => {
                            if(post === null)
                                return <></>
                            return (
                                <div className='post' key={post.id}>
                                    <div className='post-head'>
                                        <div className='post-title'>
                                            <h2>{post.title}</h2>
                                            {post.edit?
                                                <p>Edited: {post.edit}</p>
                                            :
                                                <p>Posted: {post.date}</p>
                                            }   
                                        </div>
                                    </div>
                                    <p className='post-desc'>{post.desc}</p>
                                    <div className='post-info'>
                                        {post.user !==undefined ? <p>Posted by: {post.user}</p> : <></>}
                                        <p>Views: {post.views !==undefined ? post.views : "0"}</p>
                                    </div>
                                    <Link to={`/post/${post.id}`} state={currentPage}>
                                        <button type='button'>Show post</button>
                                    </Link>
                                </div>
                            )
                        })}
                    </section>
                    <Pagination
                        postsPerPage={5} 
                        totalPosts={allUserPosts.length} 
                        paginate={paginate} 
                        currentPage={currentPage}
                    />
                </section>
            </div>
        )
    }

    if(userProfile === null){
        return(
            <div className="profile-container">
                <div className="profile-header not-found">
                    <h2>Ooops!</h2>
                    <h3>User {username} not found</h3>
                    <Link to={`/`}>
                        <button type="button">Go to home page</button>
                    </Link>
                </div>
            </div>
        )
    }

    return(
        <div className="profile-container">
            <div className="profile-header">
                <h1>User: {username}</h1>
                <p>Total number of posts: <span className="profile-number">{totalPosts}</span></p>
                <p>Total views of posts: <span className="profile-number">{totalViews}</span></p>
                {userProfile ? <>
                <p>Registered: <span className="profile-number">{userProfile.registered}</span></p>
                <p>Last logged: <span className="profile-number">{userProfile.lastLogged}</span></p>
                <p>Login count: <span className="profile-number">{userProfile.loginCount}</span></p>
                </>
                : <></>}
            </div>
            <div className="profile-last-best-posts">
                {lastPost ? 
                    <span className="profile-span">
                        <p>Last post: </p>
                        <div className='post'>
                                <div className='post-head'>
                                    <div className='post-title'>
                                        <h2>{lastPost.title}</h2>
                                        {lastPost.edit?
                                            <p>Edited: {lastPost.edit}</p>
                                        :
                                            <p>Posted: {lastPost.date}</p>
                                        }   
                                    </div>
                                </div>
                                <p className='post-desc'>{lastPost.desc}</p>
                                <div className='post-info'>
                                    <p>Views: {lastPost.views !==undefined ? lastPost.views : "0"}</p>
                                </div>
                                <Link to={`/post/${lastPost.id}`}>
                                    <button type='button'>Show post</button>
                                </Link>
                            </div>
                    </span>
                    
                    : <></>}
                {bestPost ? 
                    <span className="profile-span">
                        <p>Most viewed post: </p>
                        <div className='post'>
                                <div className='post-head'>
                                    <div className='post-title'>
                                        <h2>{bestPost.title}</h2>
                                        {bestPost.edit?
                                            <p>Edited: {bestPost.edit}</p>
                                        :
                                            <p>Posted: {bestPost.date}</p>
                                        }   
                                    </div>
                                </div>
                                <p className='post-desc'>{bestPost.desc}</p>
                                <div className='post-info'>
                                    <p>Views: {bestPost.views !==undefined ? bestPost.views : "0"}</p>
                                </div>
                                <Link to={`/post/${bestPost.id}`}>
                                    <button type='button'>Show post</button>
                                </Link>
                            </div>
                    </span>
                    : <></>}
                    {totalPosts === 0 ? 
                        <span className="profile-span">
                            <p>You didn't post anything yet.</p>
                            <Link to="/newpost"><button className="profile-button">Create new post</button></Link>
                        </span>
                    :<></>}
            </div>
            <div className="profile-buttons">
                    <button className="profile-button" onClick={()=> {setShowAllPosts(true); window.scrollTo(0, 0)}}>Show all {username} posts</button>
            </div>
            
        </div>
    )
}