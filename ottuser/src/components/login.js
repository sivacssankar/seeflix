import Navbar from "./navbar";
import EmberBackground from "./color";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

    const [email,setEmail]=useState("")
    var nav=useNavigate()
    const [error,setError]=useState("")
    const[pass,setPass]=useState("")
    var user={
        email:email,password:pass,
    }

    function handleSubmit(e){
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/login',user).then(response=>{
        setError("")
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("userid",response.data.id);
        nav("/homepage")}).catch(error=>{ if(error.response.data.error){
                setError(error.response.data.error)
            }else{
                setError('Failed to login user. Please contact admin')
            }})


    }
    
    return (
    <div>
        <Navbar/>
        <EmberBackground>
        <div className="container">
            <div className="row">
                <div className="col-8 offset-2">
                    <h1>Login</h1>
                    {error?<div className="alert alert-danger">{error}</div>:''}
                  <div className="form-group">
                        <label>Email:</label>
                        <input type="text"
                        className="form-control"
                        value={email}
                        onInput={(e)=>setEmail(e.target.value)}
                         />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password"
                        className="form-control"
                        value={pass}
                        onInput={(e)=>setPass(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary float-right" onClick={handleSubmit}>Login</button>
                    </div>
                </div>
            </div>
        </div>
        </EmberBackground>
    </div>)
}

export default Login;