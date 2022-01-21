import React, { useState, useEffect, useCallback } from 'react';
import ContentHeader from '../../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../../DataTableFilter"
import { Link, useSearchParams, useParams } from "react-router-dom";
import Error404 from '../Error404';

function ProjectItems() {
    const { id } = useParams();
    const columns = [
        {
            name: 'SKU',
            selector: row => row.inventory_SKU,
            sortable: true,
            cell: (row)=><Link to={'../edit/' + row.id}>{row.inventory_SKU}</Link>,
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
            name: 'Notes',
            selector: row => (row.notes == null) ? "" : row.notes,
            sortable: true,
            hide: 'md',
        },
        {
            name: 'Added By',
            selector: row => (row.user_fullname == null) ? "" : row.user_fullname,
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
    const [typeName, setTypeName] = useState(' ');
    const [states, setStates] = useState({ // form values
        error: null,
        isDataLoaded: false,
        isTypeNameLoaded: false,
      });

    const [searchParams] = useSearchParams(); // search params
    const [filterText, setFilterText] = useState((searchParams.get('search')) ?  searchParams.get('search') : '');

    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredItems = data.filter(function(item) {
        let itemSKU = (item.inventory_SKU == null) ? "" : item.inventory_SKU;
        let itemDescription = (item.description == null) ? "" : item.description;
    
        if ((itemSKU.toLowerCase().includes(filterText.toLowerCase())) || (itemDescription.toLowerCase().includes(filterText.toLowerCase()) )) {
            return true;
        } else {
            return false;
        }
    });


    const fetchData = useCallback(() => { // fetch inventory
        // useCallback: React creates a new function on every render
        // Here we useCallback to memoize (store) the function.
        // Therefore, this function only change if 'id' changes

        fetch(`http://site.test/WebIMS/api/projects/read?type=${id}`, {
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
            fetch(`http://site.test/WebIMS/api/projects/types/read?id=${id}`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        setTypeName( (response[0]) ? response[0].name : null );
                        setStates(prevState => ({
                            ...prevState,
                            isTypeNameLoaded: true,
                        }));
                        
                    },
                    (error) => {
                        setStates(prevState => ({
                            ...prevState,
                            isTypeNameLoaded: true,
                            error
                        }));
                    }
                )
        }


	}, [id, fetchData]);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!typeName) {
        return <>{<Error404/>}</>;
    } else if (!(states.isTypeNameLoaded)) {
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
                                            <DataTableFilter placeholderText={"SKU or Description"} setResetPaginationToggle={setResetPaginationToggle} resetPaginationToggle={resetPaginationToggle} setFilterText={setFilterText} filterText={filterText} />
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
export default ProjectItems;