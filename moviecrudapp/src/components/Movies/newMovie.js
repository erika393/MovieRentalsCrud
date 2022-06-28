import React, { useEffect, useState } from 'react'
import './style.css'
import api from '../../services/api'
import { useHistory, useParams } from 'react-router-dom'
import { Switch } from '@mui/material'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function NewMovie() {

    const { movieId } = useParams()
    const [genres, setGenres] = useState([])

    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [active, setActive] = useState(false)
    const [genreId, setGenreId] = useState('')
    const [modal, setModal] = useState(false)

    const history = useHistory();

    const token = localStorage.getItem('token')

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const handleChange = () => {
        setActive(!active)
    }

    const redirectPage = () => {
        history.push('/movies')
    }

    useEffect(() => {
        api.get('api/genres', authorization).then(
            response => {
                setGenres(response.data)
            }, token)
        //se for igual a 0 entao eh um novo filme, se nao, eh para editar
        if (movieId === '0')
            return
        else
            loadMovie()
    }, movieId)

    async function loadMovie() {
        try {
            //ira retornar os dados de um filme pelo id
            const response = await api.get(`api/movies/${movieId}`, authorization)
            setId(response.data.id)
            setName(response.data.name)
            setCreationDate(new Date(response.data.creationDate).toJSON())
            setActive(response.data.active)
            setGenreId(response.data.genreId)
        } catch (error) {
            alert('Error retrieving movie' + error)
            history.push('/movies')
        }
    }

    async function saveOrUpdate(event) {
        event.preventDefault()
        //setCreationDate((new Date(creationDate.replaceAll("-", "/"))).toISOString())

        const data = {
            name,
            creationDate,
            active,
            genreId
        }

        try {
            if (movieId === '0') {
                //ira enviar a requisicao para criar
                await api.post('api/Movies', data, authorization)

            } else {
                //ira enviar a requisicao para atualizar
                data.id = id;
                await api.put(`api/Movies/${id}`, data, authorization)
            }
        } catch (error) {
            alert('Error recording movie ' + error)
            console.log(error)
        }
        history.push('/movies')
    }

    return (
        <div className='new-movie-container'>
            <Modal isOpen="true">
                <ModalHeader>{movieId === '0' ? 'Add Movie' : "Update Movie"}</ModalHeader>
                <ModalBody>
                    <div className='form-group'>
                        <form onSubmit={saveOrUpdate}>
                            <label>Name:</label>
                            <br />
                            <input type="text" value={name} onChange={e => setName(e.target.value)} />
                            <label>Creation Date:</label>
                            <br />
                            <input type="date" value={creationDate} onChange={e => setCreationDate((e.target.value))} />
                            <select className='form-select' value={genreId} onChange={e => setGenreId(e.target.value)}>
                                <option value="" disabled>Select a Genre</option>
                                {(genres.filter(g => g.active == true)).map(genreItem => (
                                    <option value={genreItem.id}>{genreItem.name}</option>
                                ))}
                            </select>
                            <Switch onClick={handleChange} checked={active} />
                            <br />
                            <div class="organize-buttons">
                                <button className='btn btn-primary' type='submit'>{movieId === '0' ? 'Add Movie' : "Update Movie"}</button>
                                <button className='btn btn-danger' onClick={redirectPage}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}