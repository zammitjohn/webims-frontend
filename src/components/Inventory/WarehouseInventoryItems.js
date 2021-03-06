import React, { useState, useEffect, useCallback, useContext } from 'react';
import { UserPrivilegesContext } from "../ProtectedRoute";
import ContentHeader from '../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../DataTableFilter"
import { Link, useSearchParams, useParams } from "react-router-dom";
import Error404 from '../Error404';
import { Row, Col }  from 'react-bootstrap';
import InventoryImportModal from './InventoryImportModal';
import packageJson from '../../../package.json';

function WarehouseInventoryItems() {
    // to hide and show buttons
    const privileges = useContext(UserPrivilegesContext);

    // modal props
    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);
    
    const { id } = useParams();
    const columns = [
        {
            name: 'SKU',
            selector: row => row.SKU,
            sortable: true,
            cell: (row)=><Link to={'../edit/' + row.id}>{row.SKU}</Link>,
            grow: 2,
        },
        {
            name: 'Category',
            selector: row => row.type_name,
            sortable: true,
            cell: (row)=><Link to={'../category/' + row.warehouse_categoryId}>{row.warehouse_category_name + ' (' + row.warehouse_category_importName + ')'}</Link>,
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
    const [warehouse, setWarehouse] = useState({
        name : ' ',
        supportImport : false
    });
    const [states, setStates] = useState({ // form values
        error: null,
        isDataLoaded: false,
        isWarehouseLoaded: false,
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

    const ImportButton = () => {
        if ((privileges.canImport === true) && (warehouse.supportImport.toString() === '1')) {
            /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
            return (<a href="#" className="btn btn-tool btn-sm" onClick={handleModalShow}> <i className="fas fa-upload"></i> </a>);
        } else {
            return (null);
        }
    }
    
    const fetchData = useCallback(() => { // fetch inventory
        // useCallback: React creates a new function on every render
        // Here we useCallback to memoize (store) the function.
        // Therefore, this function only change if 'id' changes
        fetch(`${packageJson.apihost}/api/inventory/read.php?warehouseId=${id}`, {
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
            fetch(`${packageJson.apihost}/api/warehouse/read.php?id=${id}`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        setWarehouse(prevState => ({
                            ...prevState,
                            name: ((response[0]) ? response[0].name : null),
                            supportImport: ((response[0]) ? response[0].supportImport : null)
                        }));

                        setStates(prevState => ({
                            ...prevState,
                            isWarehouseLoaded: true,
                        }));
                    },
                    (error) => {
                        setStates(prevState => ({
                            ...prevState,
                            isWarehouseLoaded: true,
                            error
                        }));
                    }
                )
        }
	}, [id, fetchData]);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!warehouse.name) {
        return <>{<Error404/>}</>;
    } else if (!(states.isWarehouseLoaded)) {
        console.log("Loading...");
        return null;
    } else {
        return (
            <>
                <ContentHeader pageName={warehouse.name}/>
                <section className="content">
                    <Row>
                        <Col>

                            <div className="card"> 
                                <div className="card-header">
                                    <h3 className="card-title">{warehouse.name}</h3>
                                        <div className="card-tools">
                                            <ImportButton/> 
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
                                        progressPending={!states.isDataLoaded}
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
                            <InventoryImportModal 
                                fetchData={fetchData}
                                warehouseId={id}
                                modalShow={modalShow}
                                setModalShow={setModalShow}
                                handleModalClose={handleModalClose}
                                handleModalShow={handleModalShow}
                            />
                        </Col>
                    </Row>
                </section>            
            </>
        );
    }
}
export default WarehouseInventoryItems;