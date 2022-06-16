import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

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
            navigate('/',{state: res.data})
        }).catch(err => {
            console.log(err)
        })
    }
  return (
    <div className="mt-[300px]">
        <div className='max-w-[50%] mx-auto bg-white'>
            <h1>Login</h1>
            Username:<input type="text" onChange={onUserNameChange} name="username" value={username}/><br/>
            Password:<input type="text" onChange={onPasswordChange} name="password" value={password}/>
            <button onClick={onSubmit}>Submit</button>
        </div>
    </div>
  )
}

export default Login 