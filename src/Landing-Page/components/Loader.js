import './styles/loader.css'

export const Loader = ({title}) => {
    return(
        <div className='loader-wraper' id="posts-top">
            <div className='loader-content'>
                <h1>{title}</h1>
                <span className="loader" aria-live="assertive"></span>
            </div>
        </div>
    )
}