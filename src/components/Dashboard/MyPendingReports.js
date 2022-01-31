import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Table }  from 'react-bootstrap';

function MyPendingReports(){

    const [data, setData] = useState([]); // data from api
    const [states, setStates] = useState({
        error: null,
        isLoaded: false,
    });

    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            fetch('http://site.test/api/reports/read_myreports.php', {
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
            <div className="card">
                <div className="card-header border-transparent">
                    <h3 className="card-title">My Pending Reports</h3>
                    <div className="card-tools">
                        {(data.length) ? (<span className="badge badge-danger">{`${data.length} report(s)`}</span>): null}
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <Table hover>
                            <tbody>
                                {data.map((report) => (
                                    <tr key={report.id} style={{cursor:'pointer'}} onClick={() => navigate(`../../reports/edit/${report.id}`)}>
                                        <td><i className="far fa-file-alt"></i>&nbsp;{report.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="card-footer clearfix">
                    <Button as={Link} to={"../../reports/create/"} size="sm" variant="secondary">New Report</Button>
                    &nbsp;
                    <Button as={Link} to={"../../reports/"} size="sm" variant="secondary">View All Reports</Button>
                </div>
            </div>
        );
    }

}

export default MyPendingReports;
