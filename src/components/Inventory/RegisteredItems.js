import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Table, Badge, Button }  from 'react-bootstrap';
import { toast } from 'react-toastify'
import { UserPrivilegesContext } from "../ProtectedRoute";

function RegisteredItems(props){
    const privileges = useContext(UserPrivilegesContext); // for delete buttons
    const [data, setData] = useState([]); // data
    const [states, setStates] = useState({
        error: null,
        isLoaded: false,
    });

    const fetchData  = useCallback(() => {// fetch data
        if (localStorage.getItem('UserSession')) {
            fetch(`/api/registry/read.php?inventoryId=${props.inventoryId}`, { // fetch form data
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

    useEffect(() => { 
        fetchData();
    }, [fetchData]);


    const handleDelete = (event) => {
        if (window.confirm("Are you sure you want to delete the item?")){
            let formData = new FormData();
            formData.append('id', event.target.id);
            fetch('/api/registry/delete.php', {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'POST',
                body: formData
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        if (response.status) {
                            toast.success(response.message);
                            fetchData();
                        } else {
                            toast.error(response.message);
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    };


    if (states.error) {
        console.log(states.error);
    } else if (!(states.isLoaded)) {
        console.log("Loading...");
        return null;
    } else if (data.length) {
        return(
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Registered Items</h3>
                </div>
                <div className="card-body table-responsive p-0" style={{maxHeight: '300px'}}>
                    <Table hover>
                        <thead>
                            <tr>
                            <th>Registry ID</th>
                            <th>Serial Number</th>
                            <th>State</th>
                            <th>Data Purchased</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row.id}>
                                    <td>{'#' + row.id}</td>
                                    <td>{row.serialNumber}</td>
                                    <td><Badge pill bg="secondary">{row.state}</Badge></td>
                                    <td>{row.datePurchased}</td>
                                    <td><Button disabled={!privileges.canDelete} variant="outline-danger" id={row.id} onClick={handleDelete} size="sm">Delete</Button></td>
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

export default RegisteredItems;