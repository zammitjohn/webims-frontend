import React, { useState, useEffect, useContext } from 'react';
import { UserPrivilegesContext } from "../ProtectedRoute";
import ContentHeader from '../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../DataTableFilter"
import { Link, useSearchParams } from "react-router-dom";
import { Row, Col }  from 'react-bootstrap';
import InventoryTransactionsModal from './InventoryTransactionsModal';
import packageJson from '../../../package.json';

function AllInventoryItems() {
    // to hide and show buttons
    const privileges = useContext(UserPrivilegesContext);

    // modal props
    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);

    const columns = [
        {
            name: 'SKU',
            selector: row => row.SKU,
            sortable: true,
            cell: (row)=><Link to={'edit/' + row.id}>{row.SKU}</Link>,
            grow: 2,
        },
        {
            name: 'Warehouse',
            selector: row => row.category_name,
            sortable: true,
            cell: (row)=><Link to={'warehouse/' + row.warehouseId}>{row.warehouse_name}</Link>,
            hide: 'sm',
        },
        {
            name: 'Category',
            selector: row => row.type_name,
            sortable: true,
            cell: (row)=><Link to={'category/' + row.warehouse_categoryId}>{row.warehouse_category_name}</Link>,
            hide: 'sm',
        },
        {
            name: 'Description',
            selector: row => (row.description == null) ? "" : row.description,
            hide: 'md',
        },
        {
            name: 'Quantity',
            selector: row => (row.qty == null) ? 0 : parseInt(row.qty),
            sortable: true,
            conditionalCellStyles: [
                {
                  when: row => parseInt(row.qty) < parseInt(row.qty_project_item_allocated),
                  style: ({ backgroundColor: 'pink' }),
                },
            ]
        },
        {
            name: 'Allocated',
            selector: row => (row.qty_project_item_allocated == null) ? 0 : parseInt(row.qty_project_item_allocated),
            sortable: true,
            hide: 'md',
        },
        {
            name: 'Supplier',
            selector: row => (row.supplier == null) ? "" : row.supplier,
            sortable: true,
            hide: 'md',
        },
        {
            name: 'Import Date',
            selector: row => (row.importDate == null) ? "" : row.importDate,
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
    const [states, setStates] = useState({ // form values
        error: null,
        isLoaded: false,
    });


    // table search
    const [searchParams] = useSearchParams(); // search params
    const [filterText, setFilterText] = useState((searchParams.get('search')) ?  searchParams.get('search') : '');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = data.filter(function(item) {
        let itemSKU = (item.SKU == null) ? "" : item.SKU;
        let itemDescription = (item.description == null) ? "" : item.description;
        let itemSupplier = (item.supplier == null) ? "" : item.supplier;

        if ((itemSKU.toLowerCase().includes(filterText.toLowerCase())) || (itemDescription.toLowerCase().includes(filterText.toLowerCase()) || (itemSupplier.toLowerCase().includes(filterText.toLowerCase())))) {
            return true;
        } else {
            return false;
        }
    });

    const fetchData = () => { // fetch inventory
        fetch(`${packageJson.apihost}/api/inventory/read.php?tag=${(searchParams.get('tag')) ?  searchParams.get('tag') : ''}`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);


    if (states.error) {
        console.log(states.error.message);
    }

    return (
        <>
            <ContentHeader pageName={'Inventory'}/>
            <section className="content">
                <Row>
                    <Col>

                        <div className="card"> 
                            <div className="card-header">
                                <h3 className="card-title">{(searchParams.get('tag')) ?  <i>{'#' + searchParams.get('tag')}</i> : 'All items'}</h3>    
                                    <div className="card-tools">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#" hidden={!privileges.canUpdate} className="btn btn-tool btn-sm" onClick={handleModalShow}> <i className="fas fa-dolly-flatbed"></i> </a> 
                                    </div>      
                            </div>
                            <div className="card-body">
            
                                <Row className='justify-content-md-left'>
                                    <Col sm="12" md="8"/>
                                    <Col sm="12" md="4">
                                        <DataTableFilter
                                            placeholderText={"Search SKU, Description or Supplier"}
                                            setResetPaginationToggle={setResetPaginationToggle}
                                            resetPaginationToggle={resetPaginationToggle}
                                            setFilterText={setFilterText}
                                            filterText={filterText}
                                        />
                                    </Col>
                                </Row>                   
                                <DataTable
                                    progressPending={!states.isLoaded}
                                    columns={columns}
                                    data={filteredItems}
                                    customStyles={customStyles}

                                    highlightOnHover
                                    striped
                                    pagination
                                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                                />
                            </div>
                        </div>
                        <InventoryTransactionsModal
                            fetchData={fetchData}
                            modalShow={modalShow}
                            handleModalClose={handleModalClose}
                        />
                    </Col>
                </Row>
            </section>            
        </>
    );
}
export default AllInventoryItems;