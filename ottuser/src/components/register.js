
import Navbar from "./navbar";


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const[name, setName]=useState("")
    const [email, setEmail]=useState("")
    const [pass, setPass]=useState("")
    const [confpass, setConfpass]=useState("")
    const [message, setMessage]=useState("")
    var navigate=useNavigate()
    

    // email validation

    function Registeruser(e){

e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setMessage("Invalid email format");
            return;
        }
        if(pass!==confpass){
            setMessage("password not match")
            return;
        }

        var user={
            name:name,
            email:email,
            password:pass
        }
console.log(pass)
        axios.post("http://127.0.0.1:8000/signup",user).then(response=>{
            setMessage("")
            console.log(response.data)
            
            navigate("/login")
        }).catch(error=>{
                if(error.response.data.message){
                setMessage(error.response.data.message);
            }else{
                setMessage('Failed to connect to api');}
            })

        }
    
    return <div>
        <Navbar/>
        
        <div className="container">
            <div className="row">
                <div className="col-8 offset-2">
                    <h1>Register</h1>
                    {/* if error occcures */}
                     {message?<div className="alert alert-danger">{message}</div>:''}

                     <div className="form-group">
                        <label>Name:</label>
                        <input type="text"
                        className="form-control"
                        value={name}
                        onInput={(e)=>setName(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text"
                        className="form-control"
                        value={email}
                        onInput={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password"
                        className="form-control"
                        value={pass}
                        onInput={(e)=> setPass(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password"
                        className="form-control"
                        value={confpass}
                        onInput={(e)=>setConfpass(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary float-right" onClick={Registeruser}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
}

export default Register;