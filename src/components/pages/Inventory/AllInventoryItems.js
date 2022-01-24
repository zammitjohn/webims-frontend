import React, { useState, useEffect } from 'react';
import ContentHeader from '../../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../../DataTableFilter"
import { Link, useSearchParams } from "react-router-dom";

function AllInventoryItems() {
    const columns = [
        {
            name: 'SKU',
            selector: row => row.SKU,
            sortable: true,
            cell: (row)=><Link to={'edit/' + row.id}>{row.SKU}</Link>,
            grow: 2,
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
            cell: (row)=><Link to={'category/' + row.category_id}>{row.category_name}</Link>,
            hide: 'sm',
        },
        {
            name: 'Type',
            selector: row => row.type_name,
            sortable: true,
            cell: (row)=><Link to={'type/' + row.type_id}>{row.type_name}</Link>,
            hide: 'sm',
        },
        {
            name: 'Description',
            selector: row => (row.description == null) ? "" : row.description,
            sortable: true,
            hide: 'md',
        },
        {
            name: 'Quantity',
            selector: row => (row.qty == null) ? "" : row.qty,
            sortable: true,
        },
        {
            name: 'Allocated',
            selector: row => (row.qty_projects_allocated == null) ? "" : row.qty_projects_allocated,
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
                paddingLeft: '10px', // override the cell padding for data cells
                paddingRight: '10px',
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
        fetch('http://site.test/WebIMS/api/inventory/read', {
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
            <ContentHeader pageName={'Inventory'}/>
            <section className="content">
                <div className="row">
                    <div className="col-12">

                        <div className="card"> 
                            <div className="card-header">
                                <h3 className="card-title">All items</h3>
                                    <div className="card-tools">
                                        <DataTableFilter
                                            placeholderText={"SKU, Description or Supplier"}
                                            setResetPaginationToggle={setResetPaginationToggle}
                                            resetPaginationToggle={resetPaginationToggle}
                                            setFilterText={setFilterText}
                                            filterText={filterText}
                                        />
                                    </div>     
                                    <div className="card-tools">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#" className="btn btn-tool btn-sm" data-toggle="modal" data-target="#modal-transaction" onClick={fetchData}> <i className="fas fa-dolly-flatbed"></i> </a> 
                                    </div>      
                            </div>                   
                            <DataTable
                                progressPending={!states.isLoaded}
                                columns={columns}
                                data={filteredItems}
                                customStyles={customStyles}
                                highlightOnHover
                                striped
                                pagination
                                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                                persistTableHead
                            />
                
                        </div>
                    </div>
                </div>
            </section>            
        </>
    );
}
export default AllInventoryItems;