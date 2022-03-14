import React, { useState, useEffect, useCallback, useContext } from 'react';
import { UserPrivilegesContext } from "../ProtectedRoute";
import ContentHeader from '../ContentHeader';
import DataTable from 'react-data-table-component';
import { useParams, useNavigate } from "react-router-dom";
import Error404 from '../Error404';
import ProjectsImportModal from './ProjectsImportModal';
import { Row, Col }  from 'react-bootstrap';
import { toast } from 'react-toastify'
import packageJson from '../../../package.json';
import { downloadCSVFile } from '../../utils/common.js';

function ProjectItems() {
    // to hide and show buttons
    const privileges = useContext(UserPrivilegesContext);

    // modal props
    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);

    const { id } = useParams();
    let navigate = useNavigate();
    const columns = [
        {
            name: 'SKU',
            selector: row => (row.inventory_SKU == null) ? "" : row.inventory_SKU,
            sortable: true,
            grow: 2,
        },
        {
            name: 'Quantity',
            selector: row => (row.qty == null) ? 0 : parseInt(row.qty),
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => (row.description == null) ? "" : row.description,
            hide: 'md',
        },
        {
            name: 'Notes',
            selector: row => (row.notes == null) ? "" : row.notes,
            hide: 'md',
        },
        {
            name: 'Added By',
            selector: row => (row.user_fullName == null) ? "" : row.user_fullName,
            sortable: true,
            hide: 'md',
        },
    ];

    const customStyles = {
        rows: {
            style: {
                fontSize: '15px',
            },
        },
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
            },
        },
    };
    
    const [data, setData] = useState([]); // data from api
    const [projectName, setProjectName] = useState(' ');
    const [states, setStates] = useState({ // form values
        error: null,
        isDataLoaded: false,
        isProjectNameLoaded: false,
      });

    const projectDelete = useCallback(() => {
        if (window.confirm("Are you sure you want to delete the project?")) {
            let bodyData = {
                'id': id
            }
            fetch(`${packageJson.apihost}/api/project/delete.php`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'DELETE',
                body: JSON.stringify(bodyData)
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        if (response.status) {
                            toast.success(response.message);
                            navigate('/', { replace: true })
                        } else {
                            toast.error(response.message);
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }, [id, navigate])

    const fetchData = useCallback(() => { // fetch inventory
        // useCallback: React creates a new function on every render
        // Here we useCallback to memoize (store) the function.
        // Therefore, this function only change if 'id' changes

        fetch(`${packageJson.apihost}/api/project/item/read.php?projectId=${id}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
            })
            .then(res => res.json())
            .then(
                (data) => {
                    setData(data);
                    setStates(prevState => ({
                        ...prevState,
                        isDataLoaded: true,
                    }));     
                },
                (error) => {            
                    setStates(prevState => ({
                        ...prevState,
                        isDataLoaded: true,
                        error
                    }));
                }
            )
    }, [id]);

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            fetchData();
            fetch(`${packageJson.apihost}/api/project/read.php?id=${id}`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        setProjectName( (response[0]) ? response[0].name : null );
                        setStates(prevState => ({
                            ...prevState,
                            isProjectNameLoaded: true,
                        }));
                        
                    },
                    (error) => {
                        setStates(prevState => ({
                            ...prevState,
                            isProjectNameLoaded: true,
                            error
                        }));
                    }
                )
        }
	}, [id, fetchData]);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!projectName) {
        return <>{<Error404/>}</>;
    } else if (!(states.isProjectNameLoaded)) {
        console.log("Loading...");
        return null;
    } else {
        return (
            <>
                <ContentHeader pageName={projectName}/>
                <section className="content">
                    <Row>
                        <Col>
                            <div className="card"> 
                                <div className="card-header">
                                    <h3 className="card-title">{projectName}</h3>   
                                        <div className="card-tools">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" className="btn btn-tool btn-sm" onClick={() => downloadCSVFile('/api/project/download.php', id, `project_${projectName}`)}> <i className="fas fa-download"></i> </a> 
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" hidden={!privileges.canUpdate} className="btn btn-tool btn-sm" onClick={handleModalShow}> <i className="fas fa-upload"></i> </a> 
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" hidden={!privileges.canDelete} className="btn btn-tool btn-sm" onClick={projectDelete}> <i className="fas fa-trash"></i> </a> 
                                        </div>      
                                </div>
                                <div className="card-body">                                     
                                    <DataTable
                                        progressPending={!states.isDataLoaded}
                                        columns={columns}
                                        data={data}
                                        customStyles={customStyles}
                                        highlightOnHover
                                        dense
                                        pagination
                                        paginationPerPage={15}
                                        paginationRowsPerPageOptions={[15, 30, 45, 60, 75]}
                                        pointerOnHover
                                        onRowClicked={(row) => navigate(`../edit/${row.id}`)}
                                    />
                                </div>
                            </div>
                            <ProjectsImportModal 
                                fetchData={fetchData}
                                id={id}
                                modalShow={modalShow}
                                handleModalClose={handleModalClose}
                            />
                        </Col>
                    </Row>
                </section>            
            </>
        );
    }
}
export default ProjectItems;