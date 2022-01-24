import React, { useState, useEffect, useCallback, useContext } from 'react';
import { UserPrivilegesContext } from "../../ProtectedRoute";
import ContentHeader from '../../ContentHeader';
import DataTable from 'react-data-table-component';
import DataTableFilter from "../../DataTableFilter"
import { Link, useSearchParams, useParams } from "react-router-dom";
import Error404 from '../Error404';
import ProjectsImportModal from './ProjectsImportModal';

function ProjectItems() {
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

    // table search
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

    const csvDownload = useCallback(() => {
        fetch(`http://site.test/WebIMS/api/projects/types/download?id=${id}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `project_${typeName}.csv`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        });
    }, [id, typeName])

    const projectDelete = useCallback(() => {
        if (window.confirm("Are you sure you want to delete the project?")) {
            let formData = new FormData();
            formData.append('id', id);
            fetch('http://site.test/WebIMS/api/projects/types/delete', {
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
                            window.location.href = '/';
                        } else {
                            alert(response.message); 
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }, [id])

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
                                            <DataTableFilter
                                                placeholderText={"SKU or Description"}
                                                setResetPaginationToggle={setResetPaginationToggle}
                                                resetPaginationToggle={resetPaginationToggle}
                                                setFilterText={setFilterText}
                                                filterText={filterText}
                                            />
                                        </div>     
                                        <div className="card-tools">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" className="btn btn-tool btn-sm" onClick={csvDownload}> <i className="fas fa-download"></i> </a> 
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" hidden={!privileges.canUpdate} className="btn btn-tool btn-sm" onClick={handleModalShow}> <i className="fas fa-upload"></i> </a> 
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" hidden={!privileges.canDelete} className="btn btn-tool btn-sm" onClick={projectDelete}> <i className="fas fa-trash"></i> </a> 
                                        </div>      
                                </div>                   
                                <DataTable
                                    progressPending={!states.isDataLoaded}
                                    columns={columns}
                                    data={filteredItems}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    pagination
                                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                                    persistTableHead
                                />

                                <ProjectsImportModal 
                                    fetchData={fetchData}
                                    type={id}
                                    modalShow={modalShow}
                                    setModalShow={setModalShow}
                                    handleModalClose={handleModalClose}
                                    handleModalShow={handleModalShow}
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