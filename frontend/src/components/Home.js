import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

const Home = () => {
    const data = useLocation()
    const userData = data.state.uname
    const [sites, setSites] = useState(data.state.sites)
    const [comps, setComps] = useState([])
    const [urlname, setUrlName] = useState("")
    const [url, setUrl] = useState("")
    const onUrlChange = (e) => {
        setUrl(e.target.value)
    }
    const onUrlNameChange = (e) => {
        setUrlName(e.target.value)
    }
    const flushForm = () => {
        setUrlName("")
        setUrl("")
    }
    const onAddUrl = () => {
        const data = {
            url_name: urlname,
            url
        }
        axios.put(`/apis/actions/addSite?uname=${userData}`, data).then((res) => {
            const data = res.data.sites
            if(!data) {
                console.log("Error!!!")
            }
            else {
                setSites(data)
                flushForm()
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const changeSiteStatus = (obj) => {
        const arr = [...sites]
        for(let i = 0;i < arr.length;i++) {
            if(arr[i].Url_name === obj.Url_name) {
                arr[i] = obj
            }
        }
        setSites(arr)
    }
    const onCheckStatus = (ele) => {
        const data = {
            url_name: ele.target.getAttribute('site')
        }
        console.log(data)
        axios.put(`/apis/actions/checkAndUpdate?uname=${userData}`, data).then(res => {
            const site = res.data
            if(!site) {
                console.log("Error!")
            }
            else {
                changeSiteStatus(site)
            }
        })
    }
    const removeSite = (ele) => {
        const data = {
            url_name: ele.target.getAttribute('site')
        }
        console.log(data)
        axios.put(`/apis/actions/remSite?uname=${userData}`, data).then(res => {
            const data = res.data.sites
            if(!data) {
                console.log("Error!")
            }
            else {
                setSites(data)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        const checkComps = sites.map((ele) => {
            return (<div key={ele.Url_name}>
                        <p>Site Name: {ele.Url_name}</p>
                        <p>Site URL: {ele.URL}</p>
                        <p>Site Last Checked: {ele.LastChecked}</p>   
                        <p>Last Checked Status: {(ele.LastCheckStat) ? "UP" : "DOWN"}</p>
                        <button site={ele.Url_name} onClick={onCheckStatus}>Check Status</button><br/>
                        <button site={ele.Url_name} onClick={removeSite}>Remove Site</button>
                    </div>)
        })
        setComps(checkComps)
    },[sites])
  return (
    <div>
        <h1>Welcome</h1>
        {comps}
        <div>
            <input name="url_name" type="text" onChange={onUrlNameChange} value={urlname}/>
            <input name='url' type="text" onChange={onUrlChange} value={url}/>
            <button onClick={onAddUrl}>Submit</button>
        </div>
    </div>
  )
}

export default Home