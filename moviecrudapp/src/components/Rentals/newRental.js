import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useHistory, useParams } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function NewMovie() {

    const { rentalId } = useParams()

    const [id, setId] = useState(null)
    const [moviesList, setMoviesList] = useState([])
    const [cpfClient, setCpfClient] = useState()
    const [rentalDate, setRentalDate] = useState('')

    const [movies, setMovies] = useState([])

    const history = useHistory();

    const token = localStorage.getItem('token')
    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const redirectPage = (event) => {
        history.push('/rentals')
    }

    useEffect(() => {
        api.get('api/movies', authorization).then(
            response => {
                setMovies(response.data)
            }, token)
        //se for igual a 0 entao eh uma nova locacao, se nao, eh para editar
        if (rentalId === '0')
            return
        else
            loadRental()
    }, rentalId)

    function handleChangeInputCheckbox(movie, checkboxValue) {

        if (checkboxValue) {
            setMoviesList([
                ...moviesList,
                movie
            ])
        } else {
            setMoviesList(
                moviesList.filter((m) => m.id !== movie.id)
            )
        }

    }

    async function loadRental() {
        try {
            //ira retornar os dados de uma locacao pelo id
            const response = await api.get(`api/rentals/${rentalId}`, authorization)
            setId(response.data.id)
            //setMoviesList(response.data.moviesList)
            setCpfClient(response.data.cpfClient)
            setRentalDate(new Date(response.data.rentalDate).toJSON())
        } catch (error) {
            alert('Error retrieving rental' + error)
            history.push('/rentals')
        }
    }

    async function saveOrUpdate(event) {
        event.preventDefault()

        setRentalDate(new Date(rentalDate.replaceAll("-", "/")).toISOString())

        console.log(rentalDate)
        console.log(cpfClient)
        console.log(moviesList)
        const data =
        {
            moviesList,
            cpfClient,
            rentalDate
        }

        console.log(data)

        try {
            if (rentalId === '0') {
                await api.post('api/rentals', data, authorization)
            } else {
                data.id = id;
                console.log(data)
                await api.put(`api/rentals/${id}`, data, authorization)
            }
        } catch (error) {
            alert('Error recording rental ' + error)
        }
        history.push('/rentals')
    }

    return (
        <div className='new-rental-container'>
            <Modal isOpen="true">
                <ModalHeader>{rentalId === '0' ? 'Add Rental' : "Update Rental"}</ModalHeader>
                <ModalBody>
                    <div className='form-group'>
                        <form onSubmit={saveOrUpdate}>
                            <p>Select a Movie</p>
                            <div className='select-movies'>
                                {(movies.filter((m) => m.active == true)).map(movie => (
                                    <div>
                                        {(movie.rentalId == rentalId) ? (
                                            <div>
                                                <input type='checkbox' defaultChecked onChange={(e) => handleChangeInputCheckbox(movie, e.target.checked)} /> {movie.name}
                                            </div>
                                        ) : (
                                            <div>
                                                <input type='checkbox' onChange={(e) => handleChangeInputCheckbox(movie, e.target.checked)} /> {movie.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <br />
                            <div class="row">
                                <div class="col">
                                    <label>CPF:</label>
                                    <br />
                                    <input type="number" placeholder="000.000.000-00" value={cpfClient} onChange={e => setCpfClient(e.target.value)} />
                                </div>
                                <div class="col">
                                    <label>Creation Date:</label>
                                    <br />
                                    <input type="date" value={rentalDate} onChange={e => setRentalDate(e.target.value)} />
                                </div>
                            </div>


                            <br />
                            <div class="organize-buttons">
                                <button className='btn btn-primary' type='submit'>{rentalId === '0' ? 'Add Rental' : "Update Rental"}</button>
                                <button className='btn btn-danger' onClick={redirectPage}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </div>


    )
}