import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import "./Register.css"
import "../Main.css"

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const onUserNameChange = (ele) => {
        setUsername(ele.target.value)
    }
    const onPasswordChange = (ele) => {
        setPassword(ele.target.value)
    }
    const navigate = useNavigate()
    const onSubmit = () => {
        const data = {
            uname: username,
            pass: password
        }
        axios.post('/apis/actions/newUser', data).then(res => {
            const user = res.data
            if(!user) {
                console.log("Error!")
            }
            else {
                navigate('/')
            }
        })
    }
  
    return (
        <div className="flex depp-pinky-finger">
            <div className='center depp-pinky-elumbu'>
            <h1>Register</h1>
            Enter Username : <input className="input" type="text" onChange={onUserNameChange} name="username" value={username}/><br/>
            Enter Password :  <input className="input" type="password" onChange={onPasswordChange} name="password" value={password}/><br/>
            <button className="buttons" onClick={onSubmit}>Submit</button><br/>
            Old User? <button className="buttons" onClick={()=>navigate('/')}>Login</button>
        </div></div>
        
    )
}

export default Register