import React, { useEffect, useState } from 'react'
import './style.css'
import api from '../../services/api'
import { useHistory, useParams } from 'react-router-dom'
import {Switch} from '@mui/material'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function NewGenre(){

    const {genreId} = useParams()
    
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [active, setActive] = useState(true)

    const history = useHistory();

    const token = localStorage.getItem('token')
    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const redirectPage = (event) => {
        history.push('/genres')
    }

    useEffect(() => {
        //se for igual a 0 entao eh um novo genero, se nao, eh para editar
        if (genreId === '0')
            return
        else
            loadGenre()
    }, genreId)

    async function loadGenre() {
        try {
            //ira retornar os dados de um genero pelo id
            const response = await api.get(`api/genres/${genreId}`, authorization)

            setId(response.data.id)
            setName(response.data.name)
            setCreationDate(response.data.creationDate)
            setActive(response.data.active)
        } catch (error) {
            alert('Error retrieving genre' + error)
            history.push('/genres')
        }
    }

    async function saveOrUpdate(event){
        event.preventDefault()

        const data = {
            name,
            creationDate,
            active,
        }

        try{
            if(genreId === '0'){
                //ira enviar a requisicao para criar
                await api.post('api/genres/create', data, authorization)
            }else{
                //ira enviar a requisicao para atualizar
                data.id = id;
                await api.put(`api/genres/${id}`, data, authorization)
            }
        }catch(error){
            alert('Error recording genre ' + error)
        }
        history.push('/genres')
    }

    const handleChange = () => {
        setActive(!active)
    }

    return(
        <div className='new-genre-container'>
            <Modal isOpen="true">
                <ModalHeader>{genreId === '0' ? 'Add Genre' : "Update Genre"}</ModalHeader>
                <ModalBody>
                    <div className='form-group'>
                        <form onSubmit={saveOrUpdate}>
                            <div class="row">
                                <div class="col">
                                    <label>Name:</label>
                                    <br />
                                    <input type="text" placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div class="col">
                                    <label>Creation Date:</label>
                                    <br />
                                    <input type="date" value={creationDate} onChange={e => setCreationDate(e.target.value)} />
                                </div>
                                <p className='text-end'>Data Atual: {(new Date(creationDate)).toLocaleDateString()}</p>
                            </div>
                            <Switch onClick={handleChange} checked={active} />
                            <div class="organize-buttons">
                                <button className='btn btn-primary' type='submit'>{genreId === '0' ? 'Add Genre' : "Update Genre"}</button>
                                <button className='btn btn-danger' onClick={redirectPage}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}