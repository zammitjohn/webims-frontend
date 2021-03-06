import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button }  from 'react-bootstrap';
import Select from 'react-select'
import packageJson from '../../../package.json';

function ReportForm(props) {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [serialNumbersFaulty, setSerialNumbersFaulty] = useState([]);
    const [serialNumbersReplacement, setSerialNumbersReplacement] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => { // trigger and populate serial numbers dropdown on inventoryId change
        if (localStorage.getItem('UserSession')) {
            let inventoryId = (props.values.inventoryId) ? props.values.inventoryId : null;
            fetch(`${packageJson.apihost}/api/registry/read.php?inventoryId=${inventoryId}`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (data) => {
                        let serialNumbers_arr_faulty = [{label: 'None', value: '', isDisabled: false }];
                        let serialNumbers_arr_replacement = [{label: 'None', value: '', isDisabled: false }];
                        // populate faulty dropdown
                        data.forEach(function (item) {
                            if (item.state === 'Faulty') {
                                serialNumbers_arr_faulty.push({label: `#${item.id}: ${item.serialNumber}`, value: item.id, isDisabled: true }); 
                            } else {
                                serialNumbers_arr_faulty.push({label: `#${item.id}: ${item.serialNumber}`, value: item.id, isDisabled: false }); 
                            }
                        });
                        setSerialNumbersFaulty(serialNumbers_arr_faulty);

                        // populate replacement dropdown
                        data.forEach(function (item) {
                            if (item.state === 'Faulty' || item.state === 'Replacement') {
                                serialNumbers_arr_replacement.push({label: `#${item.id}: ${item.serialNumber}`, value: item.id, isDisabled: true }); 
                            } else {
                                serialNumbers_arr_replacement.push({label: `#${item.id}: ${item.serialNumber}`, value: item.id, isDisabled: false }); 
                            }
                        });
                        setSerialNumbersReplacement(serialNumbers_arr_replacement);

                    },
                    (error) => {            
                        console.log(error);
                    }
                )
        }
    }, [props.values.inventoryId])

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            // populate inventory dropdown
            fetch(`${packageJson.apihost}/api/inventory/read.php`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (data) => {
                        setInventoryItems(data);
                    },
                    (error) => {            
                        console.log(error);
                    }
                )

            // populate users dropdown
            fetch(`${packageJson.apihost}/api/user/read.php`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        setUsers(response);
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }, [props.values.inventoryId]);

    const RenderRegistrationButton = () => {
        if (props.values.inventoryId){
            return (<Button variant="link" size="sm" onClick={() => props.handleModalShow()}>Register Item</Button>);
        } else {
            return null;
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        const fieldValue = { [id]: value };
        
        props.setValues({
            ...props.values,
            ...fieldValue,
        });
    };

    const handleInventoryIdChange = (event) => {
        const { id, value } = event.target;
        const fieldValue = { 
            [id]: value,
            faulty_registryId: '',
            replacement_registryId: ''
        };
        
        props.setValues({
            ...props.values,
            ...fieldValue,
        });
    };

    const handleFaultySNChange = (event) => {
        const fieldValue = { faulty_registryId: event.value };
        
        props.setValues({
            ...props.values,
            ...fieldValue,
        });
    }

    const handleReplacementSNChange = (event) => {
        const fieldValue = { replacement_registryId: event.value };
        
        props.setValues({
            ...props.values,
            ...fieldValue,
        });
    }

	return (
        <>                  
            <Form.Group className="mb-3">
                <Form.Label htmlFor="inventoryId">Inventory Item</Form.Label>
                <Form.Select value={props.values.inventoryId} onChange={handleInventoryIdChange} id="inventoryId" className="form-control">
                    <option value=''>Select Inventory Item</option>
                    {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                    {item.SKU + " (" + item.warehouse_category_name + ") "}
                    </option>
                    ))}
                </Form.Select>
            </Form.Group>   
                        
            <Row>
                <Col>
                            
                    <hr/>
                    <h5>Details</h5>
                    
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control value={props.values.name} onChange={handleChange} type="text" maxLength="255" id="name" placeholder="Enter hardware type / location"/>
                    </Form.Group>                     

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="ticketNumber">Ticket Number</Form.Label>
                        <Form.Control value={props.values.ticketNumber} onChange={handleChange} type="text" maxLength="255" id="ticketNumber" placeholder="Enter ticket#"/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control value={props.values.description} onChange={handleChange} type="text" maxLength="255" id="description" placeholder="Enter fault description"/>
                    </Form.Group>   

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="reportNumber">Report Number</Form.Label>
                        <Form.Control value={props.values.reportNumber} onChange={handleChange} type="text" maxLength="255" id="reportNumber" placeholder="Enter fault report#"/>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="assignee_userId">Assignee</Form.Label>
                        <Form.Select value={props.values.assignee_userId} onChange={handleChange} id="assignee_userId" className="form-control">
                            <option value=''>Select User</option>
                            {users.map(user => (
                            <option key={user.id} value={user.id}>
                            {user.firstName + ' ' + user.lastName}
                            </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <hr/>
                    
                    <h5>Serial Numbers
                        &nbsp;
                        <RenderRegistrationButton/>
                    </h5>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="faulty_registryId">Faulty</Form.Label>
                                    <Select
                                        value={{value: props.values.faulty_registryId, label: (props.values.faulty_registryId) ? `#${props.values.faulty_registryId}` : 'Select...'  }}
                                        onChange={(e) => handleFaultySNChange(e)}
                                        isSearchable={true}
                                        options={serialNumbersFaulty}
                                        id="faulty_registryId"
                                        menuPlacement="top"
                                    />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="replacement_registryId">Replacement</Form.Label>
                                    <Select
                                        value={{value: props.values.replacement_registryId, label: (props.values.replacement_registryId) ? `#${props.values.replacement_registryId}` : 'Select...'  }}
                                        onChange={(e) => handleReplacementSNChange(e)}
                                        isSearchable={true}
                                        options={serialNumbersReplacement}
                                        id="replacement_registryId"
                                        menuPlacement="top"
                                    />
                            </Form.Group>
                        </Col> 
                    </Row>              

                </Col>
                <Col>
                        
                    <hr/>
                    <h5>Dates</h5>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="dateRequested">Requested</Form.Label>
                        <Form.Control value={props.values.dateRequested} onChange={handleChange} type="date" id="dateRequested"/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="dateLeaving">Leaving</Form.Label>
                        <Form.Control value={props.values.dateLeaving} onChange={handleChange} type="date" id="dateLeaving"/>
                    </Form.Group>    

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="dateDispatched">Dispatched</Form.Label>
                        <Form.Control value={props.values.dateDispatched} onChange={handleChange} type="date" id="dateDispatched"/>
                    </Form.Group>              

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="dateReturned">Returned</Form.Label>
                        <Form.Control value={props.values.dateReturned} onChange={handleChange} type="date" id="dateReturned"/>
                    </Form.Group>

                    <hr/>

                    <h5>Miscellaneous</h5>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="AWB">AWB</Form.Label>
                                <Form.Control value={props.values.AWB} onChange={handleChange} type="text" maxLength="255" id="AWB" placeholder="Enter AWB"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="AWBreturn">AWB (return)</Form.Label>
                                <Form.Control value={props.values.AWBreturn} onChange={handleChange} type="text" maxLength="255" id="AWBreturn" placeholder="Enter return AWB"/>
                            </Form.Group>
                        </Col> 
                    </Row>                     

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="RMA">RMA</Form.Label>
                        <Form.Control value={props.values.RMA} onChange={handleChange} type="text" maxLength="255" id="RMA" placeholder="Enter RMA"/>
                    </Form.Group>              
                </Col>
            </Row>
        </>
   );

}

export default ReportForm;