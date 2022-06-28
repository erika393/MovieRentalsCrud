import React from 'react'
import { styled } from '@mui/material/styles';
import { Grid, Box, Paper } from '@mui/material'
import { Link, useHistory, useParams } from 'react-router-dom'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Layout() {

    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')

    const history = useHistory()

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    async function logout() {
        try {
            localStorage.clear();
            localStorage.setItem('token', '')
            authorization.headers = ''
            history.push('/')
        } catch (error) {
            alert('Could not log out ' + error)
        }
    }

    return (
        <section className='layout-container bg-primary'>
            <header className=''>
                <span className='title'>Welcome <strong>{email}</strong>!</span>
                <button className="btn btn-danger logout" type='button' onClick={logout}>
                    Logout
                </button>
                <br/><br/>
                <div className='bg-white row m-4 p-3 text-center mt-4 links-div'>
                    <div className='col'>
                        <Link to="/movies" className='link'>MOVIES</Link>
                    </div>
                    <div className='col'>
                        <Link to="/genres" className='link'>GENRES</Link>
                    </div>
                    <div className='col'>
                        <Link to="/rentals" className='link'>RENTALS</Link>
                    </div>
                </div>
            </header>
        </section>
    )
}