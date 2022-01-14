function DataTableFilter(props) {
    return (
        <div className="input-group input-group-sm" style={{paddingLeft: "10px", width:"220px"}} >
            <input id="search" className="form-control" type="text" placeholder={props.placeholderText} aria-label="Search Input" value={props.filterText} onChange={props.onFilter} />
            <span className="input-group-append">
                <button type="button" className="btn btn-warning btn-flat" onClick={props.onClear}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </span>
        </div>
    );
}

export default DataTableFilter;
