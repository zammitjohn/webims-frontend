import React, { useState } from 'react';
import { createSearchParams, useNavigate } from "react-router-dom";

function DataTableFilter(props) {
    const [icon, setIcon] = useState(<i className="fas fa-search" aria-hidden="true"></i>);
    const navigate = useNavigate();

    const handleClear = () => {
        if (props.filterText) {
            props.setResetPaginationToggle(!props.resetPaginationToggle);
            props.setFilterText('');
        }
        setIcon(<i className="fa fa-search" aria-hidden="true"></i>);
        navigate({
            search: `?${createSearchParams({
                search: ''
            })}`
        });
    };

    const handleChange  = e => {
        props.setFilterText(e.target.value); // calling function from parent
        if (e.target.value === ''){
            setIcon(<i className="fa fa-search" aria-hidden="true"></i>);
        } else {
            setIcon(<i className="fa fa-times" aria-hidden="true"></i>);
        }
        navigate({
            search: `?${createSearchParams({
                search: e.target.value
            })}`
        });

    };

    return (
        <div className="input-group input-group-sm" style={{paddingLeft: "10px", width:"225px"}} >
            <input id="search" className="form-control" type="text" placeholder={props.placeholderText} aria-label="Search Input" value={props.filterText} onChange={handleChange} />
            <span className="input-group-append">
                <button type="button" className="btn btn-warning btn-flat" onClick={handleClear}>
                    {icon}
                </button>
            </span>
        </div>
    );
}

export default DataTableFilter;
