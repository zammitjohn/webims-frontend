import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentHeader from '../../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../../DataTableFilter"
import { Link, useSearchParams, useParams } from "react-router-dom";
import Error404 from '../Error404';

function TypeInventoryItems() {
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
    
    let isMounted = useRef(true); // mutable flag is changed in the cleanup callback, as soon as the component is unmounted
    const [data, setData] = useState([]); // data from api
    const [typeName, setTypeName] = useState(' ');
    const [categoryName, setCategoryName] = useState('');
    const [states, setStates] = useState({ // form values
        error: null,
        isDataLoaded: false,
        isCategoryLoaded: false,
      });

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
        fetch(`http://site.test/WebIMS/api/inventory/read?type=${id}`, {
            method: 'GET',
            credentials: 'include'
            })
            .then(res => res.json())
            .then(
                (data) => {
                    if (isMounted.current) {
                        setData(data);
                        setStates(prevState => ({
                            ...prevState,
                            isDataLoaded: true,
                        }));
                    }
                },
                (error) => {
                    if (isMounted.current) {
                        setStates(prevState => ({
                            ...prevState,
                            isDataLoaded: true,
                            error
                        }));
                    }
                }
            )
    }, [id]);

    useEffect(() => {
        fetchData();
		fetch(`http://site.test/WebIMS/api/inventory/types/read?id=${id}`, {
            method: 'GET',
            credentials: 'include'
        	})
            .then(res => res.json())
            .then(
                (response) => {
                    if (isMounted.current) {
                        setTypeName( (response[0]) ? response[0].name : null  );
                        setCategoryName( (response[0]) ? response[0].category_name : null );
                        setStates(prevState => ({
                            ...prevState,
                            isLoaded: true,
                        }));
                    }
                },
                (error) => {
                    if (isMounted.current) {
                        setStates(prevState => ({
                            ...prevState,
                            isLoaded: true,
                            error
                        }));
                    }
                }
            )
        return () => { isMounted.current = false }; // toggle flag, if unmounted
	}, [id, fetchData]);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!typeName) {
        return <>{<Error404/>}</>;
    } else if (!(states.isLoaded)) {
        console.log("Loading...");
        return null;
    } else {
        return (
            <>
                <ContentHeader pageName={typeName}/>
                <section className="content">
                    <div className="row">
                        <div className="col-12">

                            <div className="card"> 
                                <div className="card-header">
                                    <h3 className="card-title">{typeName}</h3>
                                        <div className="card-tools">
                                            <DataTableFilter placeholderText={"SKU, Description or Supplier"} setResetPaginationToggle={setResetPaginationToggle} resetPaginationToggle={resetPaginationToggle} setFilterText={setFilterText} filterText={filterText} />
                                        </div>     
                                        <div className="card-tools">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" className="btn btn-tool btn-sm" data-toggle="modal" data-target="#modal-transaction" onClick={fetchData}> <i className="fas fa-dolly-flatbed"></i> </a> 
                                        </div>      
                                </div>                   
                                <DataTable
                                    progressPending={!states.isDataLoaded}
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
}
export default TypeInventoryItems;