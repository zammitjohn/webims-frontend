import React, { useState } from 'react';
import { Button, Modal, Tabs, Tab, Form, Container, Table }  from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify'
import packageJson from '../../../package.json';

function InventoryTransactionsModal(props){

    /* eslint-disable-next-line no-unused-vars */
    const [inputValue, setValue] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isReturn, setIsReturn] = useState(false);
    const [tabActiveKey, setTabActiveKey] = useState('page1');
    
    const loadOptions = async (inputValue, callback) => {
        const response = await fetch(`${packageJson.apihost}/api/inventory/search.php?term=${inputValue}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
        });

        const json = await response.json();
        const object = json.results;
        callback(object.map(i => ({ label: i.label , value: i.value , selected_qty: '1' })))
    };

    const handleQuantityChange = (itemId, e) => {
        let updatedQtys = [];
        selectedItems.forEach(function (item) { // loop selectedItems, update selected_qty field if respective input is changed
            if (item.value === itemId) {
                updatedQtys.push({label: item.label, selected_qty: e.target.value, value: item.value}); 
            } else {
                updatedQtys.push(item); 
            }
        });
        setSelectedItems(updatedQtys);
    }


    const transactionDownload = (id) => {
        fetch(`${packageJson.apihost}/api/transactions/download.php?id=${id}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            toast.info("Downloading");
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `transaction_${id}.csv`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        },
        (error) => {
            toast.error("Error occured");
            console.log(error);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // prepare data for API
        let transactionItems = [];
        selectedItems.forEach(function (item) {
            transactionItems.push({item_id: item.value, item_qty: item.selected_qty});
        });
        let data = ({return: isReturn, items: transactionItems});
    
        fetch(`${packageJson.apihost}/api/transactions/create.php`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'POST',
            body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(
                (response) => {
                    if (response.status) {
                        transactionDownload(response.id);
                        toast.success("Transaction #" + response.id + " created.");

                        if (response.returned_count){
                            toast.success(response.returned_count + " items returned.");
                        }
                        if (response.requested_count){
                            toast.success(response.requested_count + " items requested.");
                        }
                        props.fetchData();
                        
                    } else {
                    toast.warning(response.message);  
                    }
                },
                (error) => {
                    toast.error('Error occured');
                    console.log(error);
                }
            )
            props.handleModalClose();  // close modal
    }

    return(
        <Modal show={props.modalShow} onHide={props.handleModalClose} size="lg" centered>
            <Modal.Header>
                <Modal.Title>New Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs activeKey={tabActiveKey} className="mb-3">
                    <Tab eventKey="page1" title="Select Items">
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="category">Select one or more items</Form.Label>
                            <AsyncSelect
                                isClearable
                                defaultValue={selectedItems}
                                isMulti
                                cacheOptions
                                placeholder={"Search for an inventory item"}
                                loadOptions={loadOptions}
                                onInputChange={(e) => setValue(e.value)}
                                onChange={(e) => setSelectedItems(e)}
                            />
                        </Form.Group>
                        <Container>
                            <Form.Check checked={isReturn} onChange={(e) => setIsReturn(!isReturn)} type="checkbox" label="Return Items" />
                        </Container>
                        <hr/>
                        <Button variant="secondary" disabled={!selectedItems.length} onClick={(e) => setTabActiveKey('page2')}>Next</Button>

                    </Tab>
                    <Tab eventKey="page2" title="Specify Quantities">
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                            <Form.Label htmlFor="category">Item quantities</Form.Label>
                                <Table>
                                    <tbody>
                                        {selectedItems.map((item) => (
                                            <tr key={item.value}>
                                                <td><Form.Control type="number" value={item.selected_qty} onChange={(e) => handleQuantityChange(item.value, e)} min="1" max="9999"/></td>
                                                <td>{item.label}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Form.Group>
        
                            <hr/>
                            <Button variant="secondary" onClick={(e) => setTabActiveKey('page1')}>Previous</Button>
                            &nbsp;
                            <Button variant="secondary" type="submit">Submit</Button>
                        </Form>

                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );

}
export default InventoryTransactionsModal;