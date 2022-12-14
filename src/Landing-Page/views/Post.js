import { useEffect, useState } from "react"
import { Link, useLocation, useParams, useOutletContext, useNavigate } from "react-router-dom"
import { useAddView } from "../hooks/useAddView"
import { useGetPost } from "../hooks/useGetPost"
import "./styles/Post.css"
import "./styles/Posts.css"
import { Loader } from "../components"
import useAuth from "../hooks/useAuth"

export const Post = () => {
    const {id} = useParams()
    const query = useLocation()
    const [showDeleteWindow, setShowDeleteWindow] = useState(false)
    const [animateDeleteWindow, setAnimateDeleteWindow] = useState(false)
    const [postDeleted, setPostDeleted] = useState(false)
    const navigate = useNavigate()

    const uid = useOutletContext()
    const {auth} = useAuth()

    const {post, loading, postNotFound} = useGetPost(id)
    const {addView} = useAddView()

    const deletePost = async () => {
        if(auth.user === post.user)
            await fetch(`https://react-workshop-eba4b-default-rtdb.europe-west1.firebasedatabase.app/posts/${post.id}.json?auth=${uid}`, {
                method: 'DELETE',
            })
            .then(respsonse => {
                if(respsonse.ok){
                    setPostDeleted(true)
                    return respsonse
                }
                throw respsonse
            })
            .catch(err => {
                console.log(err)
            })
        else
            navigate("/posts", {replace: true})
            
    }

    const showHideDeleteWindow = (showHide) => {
        if(showHide){
            setShowDeleteWindow(true)
            setTimeout(()=>{
                setAnimateDeleteWindow(true)
            }, 1)
        }
        else{
            setAnimateDeleteWindow(false)
            setTimeout(()=>{
                setShowDeleteWindow(false)
            }, 300)
        }
    }

    useEffect(()=>{
        if(post.id!== undefined){
            if(post.views !== undefined && !isNaN(post.views)){
                addView(post.id, post.views)
            }
            else{
                addView(post.id, 0)
            }
        }
        window.scrollTo(0, 0)
    },[post])

    if (loading) {
        return <Loader title={`Loading post ${id}...`} />
    }

    if (postNotFound) {
        return (
            <section className='post-container'>
                <div className="delete-window show-delete-window">
                    <div className="delete-window-content">
                        <h2>Post not found</h2>
                        <Link to={`/posts`} className="delete-window-buttons">
                            <button type="button">Back to Posts</button>
                        </Link>
                    </div>
                </div>
            </section>
        )
    }
    return(
        <section className='post-container'>
            <div className='post post-post'>
                <div className="post-head">
                    <div className='post-title'>
                        <h2>{post.title}</h2>
                        {post.edit?
                            <p>Edited: {post.edit}<br/>Posted: {post.date}</p>
                        :
                            <p>Posted: {post.date}</p>
                        }  
                    </div>
                    <p className='post-in-desc'>{post.desc}</p>
                    <div className='post-info'>
                        {post.user !==undefined ? <p>Posted by: <Link to={`/profile/${post.user}`}>{post.user}</Link></p> : <></>}
                        <p>Views: {post.views !==undefined ? post.views : "0"}</p>
                    </div>
                </div>
                <p className='post-content'>{post.content}</p>
                <div className="post-options">
                    <Link to={`/posts`} state={{page: query.state.page, find: query.state.find}}>
                        <button type="button">Back to Posts</button>
                    </Link>
                    <span>
                        <button type="button" onClick={()=>showHideDeleteWindow(true)} className={post.user === auth.user ? "" : "button-disabled"}>Delete post</button>
                        <Link to={`/editpost/${post.id}`} className={post.user === auth.user ? "" : "button-disabled"}>
                            <button type="button">Edit post</button>
                        </Link>
                    </span>
                </div>
            </div>
            {showDeleteWindow && 
                <div className={`delete-window ${animateDeleteWindow ? "show-delete-window" : ""}`}>
                    <div className="delete-window-content">
                        {!postDeleted ?
                        <>
                            <h2>Are you sure you want to delete post "{post.title}"?</h2>
                            <span className="delete-window-buttons">
                                <button onClick={()=>deletePost()}>Yes</button>
                                <button onClick={()=>showHideDeleteWindow(false)}>Cancel</button>
                            </span>
                        </>
                        :
                        <> 
                            <h2>Post "{post.title}" has been deleted</h2>
                            <Link to={`/posts`} state={{page: query.state}} className="delete-window-buttons">
                                <button type="button">Back to Posts</button>
                            </Link>
                        </>
                        }
                    </div>
                </div>
            }
        </section>
    )
}