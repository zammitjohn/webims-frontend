import React, { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from "react-router-dom";
import { FormControl, InputGroup, Button }  from 'react-bootstrap';

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

    useEffect(() => {
        if (props.filterText) {
            setIcon(<i className="fa fa-times" aria-hidden="true"></i>);
        }
	}, [props.filterText]);

    return (
        <InputGroup className="input-group-sm" style={{paddingLeft: "10px"}} >
            <FormControl id="search" type="text" placeholder={props.placeholderText} aria-label="Search Input" value={props.filterText} onChange={handleChange} />
            <span className="input-group-append">
                <Button type="button" variant="warning" onClick={handleClear}>
                    {icon}
                </Button>
            </span>
        </InputGroup>    
    );
}

export default DataTableFilter;
