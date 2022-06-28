import React, {useState} from 'react'
import './style.css'
import logoLogin from '../../assets/logoLogin.png'
import {Button, Link} from '@mui/material'
import api from '../../services/api'
import { useHistory } from 'react-router-dom'

export default function Register(){
    //para armazenar o estado das credenciais do usuario (atual, e para editar)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassowrd] = useState()

    //historico de navegacao
    const history = useHistory()

    const redirectLogin = () => {
        history.push('/')
    }

    //implementando funcao de login
    async function login(event){
        //privando refresh da pagina
        event.preventDefault()

        if(password != confirmPassword){
            return alert('Password and Confirm Password is different!');
        }

        console.log(email)
        console.log(password)
        console.log(confirmPassword)

        //montando request
        const data = {
            email, password, confirmPassword
        }

        try{
            const response = await api.post('/api/account/createuser', data)

            //com isso o token nao expira
            localStorage.setItem('email', email)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('expiration', response.data.expiration)

            //ao se registrar eh redirecionado para a pagina de login
            alert(`User ${email} successfully registered!`)
            history.push('/register')
        }catch(error){
            alert('Register Failed! ' + error)
        }
    }

    return(
        <div className='login-container'>
            <section className='form'>
                <img src={logoLogin} alt="Login" id="imgLogin"/>
                <form  onSubmit={login}>
                    <h1>MOVIE RENTALS</h1>
                    <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <ul className='text-danger'>
                        <li>at least 1 uppercase character</li>
                        <li>at least 1 lowercase character</li>
                        <li>at least 1 special character ($,%,@)</li>
                    </ul>
                    <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={e => setConfirmPassowrd(e.target.value)}/>
                    <br/><br/>
                        <Link onClick={redirectLogin} className='register-link'>Return to Login</Link>
                    <br/><br/>
                    <Button className='button-login' type='submit' variant="outlined" color="primary" onClick={redirectLogin}>
                        Register
                    </Button>
                </form>
            </section>
        </div>
    )
}