import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import "./Login.css"
import "../Main.css"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const onUserNameChange = (ele) => {
        setUsername(ele.target.value)
    }
    const onPasswordChange = (ele) => {
        setPassword(ele.target.value)
    }
    const onSubmit = () => {
        const data = {
            uname: username,
            pass: password
        }
        axios.post('/apis/actions/getUser', data).then(res => {
            navigate('/home',{state: res.data})
        }).catch(err => {
            console.log(err)
        })
    }

  return (
    <div className="flex depp-pinky-finger">
        <div className='center depp-pinky-elumbu'>
            <h1>Login</h1>
            Enter username : <input className="input" type="text" onChange={onUserNameChange} name="username" value={username}/><br/>
            Enter password : <input className="input" type="password" onChange={onPasswordChange} name="password" value={password}/><br/>
            <button className="buttons" onClick={onSubmit}>Submit</button><br/>
  New User? <button className="buttons" onClick={()=>navigate('/signup')}>Register</button>
        </div>
    </div>
  )
}

export default Login 