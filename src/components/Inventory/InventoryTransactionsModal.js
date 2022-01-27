import React, { useState } from 'react';
import { Button, Modal, Tabs, Tab, Form, Container, Table }  from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

function InventoryTransactionsModal(props){

    /* eslint-disable-next-line no-unused-vars */
    const [inputValue, setValue] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [tabActiveKey, setTabActiveKey] = useState('page1');

    const loadOptions = async (inputValue, callback) => {
        const response = await fetch(`http://site.test/WebIMS/api/inventory/search?term=${inputValue}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
        });

        const json = await response.json();
        const object = json.results;
        callback(object.map(i => ({ label: `${i.title} (${i.category}): ${i.text}` , value: i.id })))
    };

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
                                defaultOptions
                                isMulti
                                cacheOptions
                                placeholder={"Search for an inventory item"}
                                loadOptions={loadOptions}
                                onInputChange={(e) => setValue(e.value)}
                                onChange={(e) => setSelectedItems(e)}
                            />
                        </Form.Group>
                        <Container>
                            <Form.Check type="checkbox" label="Return Items" />
                        </Container>
                        <hr/>
                        <Button variant="secondary" onClick={(e) => setTabActiveKey('page2')}>Next</Button>

                    </Tab>
                    <Tab eventKey="page2" title="Specify Quantities">
                        
                        <Form.Group className="mb-3">
                        <Form.Label htmlFor="category">Item quantities</Form.Label>

                            <Table>
                                <tbody>
                                    {selectedItems.map((item, index) => (
                                        <tr key={item.value}>
                                            <td><Form.Control type="number" defaultValue={1}/></td>
                                            <td>&nbsp;{item.label}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        </Form.Group>
                        <hr/>
                        <Button variant="secondary" onClick={(e) =>setTabActiveKey('page1')}>Previous</Button>
                        &nbsp;
                        <Button variant="secondary">Submit</Button>

                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );

}
export default InventoryTransactionsModal;