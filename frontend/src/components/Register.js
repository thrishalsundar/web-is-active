import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

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
                navigate('/login')
            }
        })
    }
  return (
    <div>
        <h1>Register</h1>
        Username:<input type="text" onChange={onUserNameChange} name="username" value={username}/><br/>
        Password:<input type="text" onChange={onPasswordChange} name="password" value={password}/>
        <button onClick={onSubmit}>Submit</button>
    </div>
  )
}

export default Register 