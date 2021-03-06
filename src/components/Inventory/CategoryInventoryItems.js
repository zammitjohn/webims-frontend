import React, { useState, useEffect, useCallback } from 'react';
import ContentHeader from '../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../DataTableFilter"
import { Link, useSearchParams, useParams } from "react-router-dom";
import Error404 from '../Error404';
import { Row, Col }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function CategoryInventoryItems() {
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
    const [type, setType] = useState({
        name : ' ',
        importName : ' ',
        warehouse_name : ' '
    });
    const [states, setStates] = useState({ // form values
        error: null,
        isDataLoaded: false,
        isTypeLoaded: false,
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


    const fetchData = useCallback(() => { // fetch inventory
        // useCallback: React creates a new function on every render
        // Here we useCallback to memoize (store) the function.
        // Therefore, this function only change if 'id' changes
        fetch(`${packageJson.apihost}/api/inventory/read.php?warehouse_categoryId=${id}`, {
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
            fetch(`${packageJson.apihost}/api/warehouse/category/read.php?id=${id}`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {

                        setType(prevState => ({
                            ...prevState,
                            name: (response[0]) ? response[0].name : null,
                            importName : (response[0]) ? response[0].importName : null,
                            warehouse_name : (response[0]) ? response[0].warehouse_name : null
                        }));

                        setStates(prevState => ({
                            ...prevState,
                            isTypeLoaded: true,
                        }));
                    },
                    (error) => {
                        setStates(prevState => ({
                            ...prevState,
                            isTypeLoaded: true,
                            error
                        }));
                    }
                )
        }
	}, [id, fetchData]);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!type.name) {
        return <>{<Error404/>}</>;
    } else if (!(states.isTypeLoaded)) {
        console.log("Loading...");
        return null;
    } else {
        return (
            <>
                <ContentHeader pageName={type.name}/>
                <section className="content">
                    <Row>
                        <Col>

                            <div className="card"> 
                                <div className="card-header">
                                    <h3 className="card-title">{type.name + ' ' + ((type.importName) ? (' (' + type.importName + ') ') : '') }</h3>       
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
                        </Col>
                    </Row>
                </section>            
            </>
        );
    }
}
export default CategoryInventoryItems;