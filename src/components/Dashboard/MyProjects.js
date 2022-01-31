import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Table }  from 'react-bootstrap';
import AddProjectModal from './AddProjectModal';

function MyProjects(){

    // modal props
    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);

    const [data, setData] = useState([]); // data from api
    const [states, setStates] = useState({
        error: null,
        isLoaded: false,
    });

    let navigate = useNavigate();

    const fetchData = () => {
        fetch('/api/projects/types/read_myprojects.php', {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
            })
            .then(res => res.json())
            .then(
                (data) => {
                    setData(data);
                    setStates({
                        isLoaded: true,
                    });
                },
                (error) => {
                    setStates({
                        isLoaded: true,
                        error
                    });
                }
            )
    };

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            fetchData();
        }
	}, []);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!states.isLoaded) {
        console.log("Loading...");
        return null;
    } else {    
        return (
            <>
                <div className="card">
                    <div className="card-header border-transparent">
                        <h3 className="card-title">My Projects</h3>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <Table hover>
                                <tbody>
                                    {data.map((project) => (
                                        <tr key={project.id} style={{cursor:'pointer'}} onClick={() => navigate(`../../projects/${project.id}`)}>
                                            <td>{project.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="card-footer clearfix">
                        <Button size="sm" onClick={() => handleModalShow()} variant="secondary">New Project</Button>
                            &nbsp;
                        <Button as={Link} to={"../../projects/create/"} size="sm" variant="secondary">Add Item</Button>
                    </div>
                </div>
                <AddProjectModal
                    modalShow={modalShow}
                    handleModalClose={handleModalClose}
                    fetchData={fetchData}
                />
            </>

        );
    }

}

export default MyProjects;
