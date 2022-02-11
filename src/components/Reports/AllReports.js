import React, { useState, useEffect } from 'react';
import ContentHeader from '../ContentHeader';
import DataTable from 'react-data-table-component';
import { useNavigate } from "react-router-dom";
import { Row, Col, Badge }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function AllReports() {
    let navigate = useNavigate();

    const RenderReportState = (props) => {
        if (props.row.isClosed === 1) {        
            return (<Badge bg="success">Closed</Badge>);
        } else if (props.row.isRepairable === 0) {
            return (<Badge bg="danger">Unrepairable</Badge>);
        } else {
            return (<Badge bg="warning">Pending</Badge>);
        }
    }

    const columns = [
        {
            name: 'Report',
            selector: row => parseInt(row.id),
            cell: row => (row.id == null) ? "" : `#${row.id} ${(row.name) ? (row.name) : ""}`,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => (row.description == null) ? "" : row.description,
            hide: 'sm',
        },
        {
            name: 'Status',
            cell: (row)=><RenderReportState row={row}/>,
        }
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
    const [states, setStates] = useState({ // form values
        error: null,
        isLoaded: false,
    });

    const fetchData = () => { // fetch reports
        fetch(`${packageJson.apihost}/api/report/read.php`, {
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
    }

    return (
        <>
            <ContentHeader pageName={'All Reports'}/>
            <section className="content">
                <Row>
                    <Col>

                        <div className="card"> 
                            <div className="card-body">                 
                                <DataTable
                                    progressPending={!states.isLoaded}
                                    columns={columns}
                                    data={data}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    dense
                                    pagination
                                    paginationPerPage={20}
                                    paginationRowsPerPageOptions={[20, 35, 50, 65, 80]}
                                    pointerOnHover
                                    onRowClicked={(row) => navigate(`edit/${row.id}`)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </section>            
        </>
    );
}
export default AllReports;