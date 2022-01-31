import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Table }  from 'react-bootstrap';

function ProjectAllocations(props){
    const [data, setData] = useState([]); // data
    const [states, setStates] = useState({
        error: null,
        isLoaded: false,
    });

    useEffect(() => { 
        if (localStorage.getItem('UserSession')) {
            fetch(`http://site.test/api/projects/read_allocations.php?inventoryId=${props.inventoryId}`, { // fetch form data
              headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
              },
              method: 'GET'
              })
              .then(res => res.json())
              .then(
                (response) => {
                  setData(response);
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
    }, [props.inventoryId]);

    if (states.error) {
        console.log(states.error);
    } else if (!(states.isLoaded)) {
        console.log("Loading...");
        return null;
    } else if (data.length) {
        return(
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Project Allocations</h3>
                </div>
                <div className="card-body table-responsive p-0" style={{maxHeight: '300px'}}>
                    <Table hover>
                        <thead>
                            <tr>
                            <th>Project</th>
                            <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row.type_id}>
                                    <td><Link to={'../../projects/' + row.type_id}>{row.type_name}</Link></td>
                                    <td>{row.total_qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    } else {
        return null;
    }

}

export default ProjectAllocations;