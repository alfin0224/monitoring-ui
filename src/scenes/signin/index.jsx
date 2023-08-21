import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, reset} from "../features/authSlice";
import api from '../../api/configApi.js';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import {
    Container,
    FormWrap,
    Icon,
    FormContent,
    Form,
    FormH1,
    FormLabel,
    FormInput,
    FormButton,
    Text
} from './SigninElements';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    
    if(user || isSuccess){
      const fetchData = async () => {
          const response = await api.get('/profile')
          .then(response => {
            toast.success('Sign In successfully.');
            navigate("/report");
          })
          .catch(error => {
            console.error('Error fetching user profile:', error);
          });
      };
      
      fetchData();
    }
  
  dispatch(reset());
}, [user, isSuccess, dispatch]);


  const Auth = async(e) => {
    e.preventDefault();
       dispatch(LoginUser({ email, password }));
  }

  return (
    <>
      <Container>
        <FormWrap>
            <Icon to="/">TATONAS</Icon>
            <FormContent>
                <Form onSubmit={Auth}>
                 {isError && <p style={{textAlign: 'center', color: 'white'}}>{message}</p> }
                    <FormH1> Sign in to your account</FormH1>
                    <FormLabel htmlFor='for'>Email</FormLabel>
                    <FormInput type='email' value={email} onChange={e => setEmail(e.target.value)} required />
                    <FormLabel htmlFor='for'>Password</FormLabel>
                    <FormInput type='password' value={password} onChange={e => setPassword(e.target.value)} required />
                    <FormButton type='submit'>{isLoading ? 'Loading...' : 'Login'}</FormButton>
                    <ToastContainer />
                    <Text>Don't Have Account? <a href='/signup'>Register Here</a></Text>
                </Form>
            </FormContent>
        </FormWrap>
      </Container>
    </>
  )
}

export default SignIn;
