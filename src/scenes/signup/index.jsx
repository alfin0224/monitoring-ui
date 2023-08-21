import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2"; 
import api from '../../api/configApi.js';



const SignUp = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const IsValidate = () => {
        let isproceed = true;

        if (password !== confPassword){
            isproceed = false;
            toast.warning('Password and Confirm Password Do Not Match!');
        }
        return isproceed;
    }

  const handleSubmit = async(e) => {
    e.preventDefault();

        const registerData = {
            name: name,
            email: email,
            password: password,
            confPassword: confPassword,
            role_id: roleId
        }

        if(IsValidate()){
            try {
                await api
                .post("/register", registerData)
                .then((response) => {
                console.log(response);
                Swal.fire({  
                    title: 'Registered successfully.',  
                    icon: 'success',  
                    text: 'Now, you can login with your account.',  
                }); 
                navigate('/');
                });
                
            } catch (error) {
                if (error.response) {
                    toast.error('Failed :' + error.message);
                    console.log(error.response);
                    console.log("server responded");
                } else if (error.request) {
                console.log("network error");
                } else {
                console.log(error);
                }
            }    
        }

  };

  
  return (
    <div style={{ minHeight: '932px', bottom:0, left:0, top:0, right:0, zIndex: 0, overflow: 'hidden', background: 'linear-gradient(108deg,rgba(199, 166, 122, 1) 0%, rgba(199, 166, 122, 1) 100%'}}>
        <Link to={'/'} className="text-light pt-5" style={{ marginLeft: '32px', marginTop: '32px', paddingTop: '50px', textDecoration: 'none', fontWeight:'700', fontSize: '32px'}}>TATONAS</Link>
    <div className="offset-lg-3 col-lg-6 pt-5 pb-5">
        <form className="container" onSubmit={handleSubmit}>
            <div className="card bg-dark text-light">
                <div className="card-header">
                    <h2 className='text-center'>Register New Account</h2>
                </div>
                <div className="card-body">

                    <div className="row">
                        <div className="col-lg-6 p-3">
                            <div className="form-group">
                                <label>Name <span className="errmsg">*</span></label>
                                <input value={name} onChange={e => setName(e.target.value)} className="form-control" required></input>
                            </div>
                        </div>
                        <div className="col-lg-6 p-3">
                            <div className="form-group">
                                <label>Email <span className="errmsg">*</span></label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control"  required></input>
                            </div>
                        </div>


                        <div className="col-lg-6 p-3">
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" required></input>
                            </div>
                        </div>
                        <div className="col-lg-6 p-3">
                            <div className="form-group">
                                <label>Confirm Password <span className="errmsg">*</span></label>
                                <input value={confPassword} onChange={e => setConfPassword(e.target.value)} type="password" className="form-control" required></input>
                            </div>
                        </div>

                        <div className="col-lg-6 p-3">
                            <div className="form-group">
                                <label>Role Account <span className="errmsg">*</span></label>
                                <select value={roleId} onChange={e => setRoleId(e.target.value)} className="form-control" required>
                                    <option disabled>Choose Your City</option>

                                    <option value="1">Super Admin</option>
                                    <option value="2">Admin</option>
                                    <option value="3">User</option>

                                </select>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="card-footer text-center">
                    <button type="submit" className="btn btn-lg btn-success">Register</button> &nbsp; &nbsp;
                    <Link to={'/'} className="btn btn-lg btn-secondary">Back</Link>
                    <ToastContainer />
                </div>
            </div>
        </form>
    </div>

</div>
  )
}

export default SignUp;
