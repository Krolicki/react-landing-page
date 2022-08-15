import './Register.css'
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { useRef , useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const Register = () =>{
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus()
    },[])

    useEffect(()=>{
        const result = USER_REGEX.test(user)
        console.log(result)
        console.log(user)
        setValidName(result)
    },[user])

    useEffect(()=>{
        const result = PWD_REGEX.test(pwd)
        console.log(result)
        console.log(pwd)
        setValidPwd(result)
        const match = pwd === matchPwd
        setValidMatch(match)
    },[pwd, matchPwd])

    useEffect(()=>{
        setErrMsg('')
    },[user, pwd, matchPwd])

    return (
        <div className='register-container'>
            <div className='register-form-wrapper'>
                <p ref={errRef} className={errMsg ? "register-errmsg" : "register-offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Register</h1>
                <form >
                    <label htmlFor='username'>
                        Username:
                        <span className={validName ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validName || !user ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input 
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => {setUser(e.target.value)}}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby = "uidnote"
                        onFocus={()=> setUserFocus(true)}
                        onBlur={()=>setUserFocus(false)}
                    />
                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "register-offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Username must be 4 to 24 characters long and begin with a letter 
                    </p>

                    <label htmlFor='password'>
                        Password:
                        <span className={validPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validPwd || !pwd ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input 
                        type="password"
                        id="password"
                        onChange={(e) => {setPwd(e.target.value)}}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby = "pwdnote"
                        onFocus={()=> setPwdFocus(true)}
                        onBlur={()=>setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "register-offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Password must be 8 to 24 characters long<br />
                        Must include uppercase and lowercase letters, a number and a special character.
                    </p>

                    <label htmlFor='confirm_pwd'>
                        Confirm Password:
                        <span className={validMatch && matchPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input 
                        type="password"
                        id="confirm-pwd"
                        onChange={(e) => {setMatchPwd(e.target.value)}}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby = "confirmnote"
                        onFocus={()=> setMatchFocus(true)}
                        onBlur={()=>setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={matchFocus && matchPwd && !validMatch ? "instructions" : "register-offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Password are not the same
                    </p>

                    <button disabled={!validName || !validMatch || !validPwd ? true : false}>
                        Sing up
                    </button>
                </form>
                <p className='register-under'>
                    Already registered?
                    <span className='register-link'>
                        <Link to="/login">Sing in</Link>
                    </span>
                </p>
            </div>
        </div>
    )
}