import React, {useState} from 'react'
import './style.css'
import logoLogin from '../../assets/logoLogin.png'
import {Button, Link} from '@mui/material'
import api from '../../services/api'
import { useHistory } from 'react-router-dom'

export default function Login(){
    //para armazenar o estado das credenciais do usuario (atual, e para editar)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState()

    //historico de navegacao
    const history = useHistory()

    const redirectRegister = () => {
        history.push('/register')
    }

    //implementando funcao de login
    async function login(event){
        //privando refresh da pagina
        event.preventDefault()

        //montando request
        const data = {
            email, password
        }

        try{
            const response = await api.post('/api/account/loginuser', data)

            //com isso o token nao expira
            localStorage.setItem('email', email)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('expiration', response.data.expiration)

            //ao logar é redirecionado para /alunos
            history.push('/movies')
        }catch(error){
            alert('Login Failed ! ' + error)
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
                    <br/><br/>
                    <Link onClick={redirectRegister} className='register-link'>Sign Up</Link>
                    <br/><br/>
                    <Button className='button-login' type='submit' variant="outlined" color="primary">
                        Login
                    </Button>
                </form>
            </section>
        </div>
    )
}