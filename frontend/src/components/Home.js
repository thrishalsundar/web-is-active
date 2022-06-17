import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import "./Home.css"
import "../Main.css"
import ClearIcon from '@mui/icons-material/Clear';
import CachedIcon from '@mui/icons-material/Cached';

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
            else if(res.data.response===-1){
                alert("Site Already exists")
                flushForm()
            }else {
                setSites(data)
                flushForm()
            }
        })
        .catch(err => {
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
            return (<div className='neoshadow depp-index-finger' key={ele.Url_name}>
                        <div className='depp-index-nerambu'>
                            <h1>{ele.Url_name}</h1>
                            <p className='siteUrl'><b>URL :</b> <a href={ele.URL} target="_blank">http://{ele.URL}/</a></p>
                            <p className='siteUrl'><b>Site Last Checked:</b> {ele.LastChecked}</p>
                            <p className='siteUrl'><b>Last Checked Status:</b> {(ele.LastCheckStat) ? "UP" : "DOWN"}</p>
                            
                        </div>
                        <div className='depp-index-elumbu'>
                                <CachedIcon className='CompIcons' site={ele.Url_name} onClick={onCheckStatus} />
                                {/* <button site={ele.Url_name} onClick={onCheckStatus}>Check Status</button>     */}
                                <ClearIcon className='CompIcons' site={ele.Url_name} onClick={removeSite} />
                            </div>
                        
                    </div>)
        })
        setComps(checkComps)
    },[sites])

  return (
    <div className='motta'>
        <h1><center>Welcome {userData}</center></h1>
        {comps}
        <div className='flex'><div className='neoshadow center depp-thumb-finger'>
            <h1>Add Site</h1>
            Enter Url Name : <input className='input depp-thumb-elumbu' name="url_name" type="text" onChange={onUrlNameChange} value={urlname}/><br/>
            Enter Url :<input className='input depp-thumb-elumbu' name='url' type="text" onChange={onUrlChange} value={url}/><br/>
            <button className='buttons' onClick={onAddUrl}>Submit</button>
        </div></div>
        
    </div>
  )
}

export default Home