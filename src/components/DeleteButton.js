import React, { useState, useEffect } from 'react';

function DeleteButton(props) {

	const [state, setState] = useState('')

	function getUserPrivilege() {
		if ((localStorage.getItem('Privileges'))) {
            if (JSON.parse(localStorage.getItem('Privileges'))[0].canDelete === true) {
                return <button type="button" onClick={props.deleteObject} className="btn btn-danger">Delete</button>;
            } else {
                return <button disabled type="button" onClick={props.deleteObject} className="btn btn-danger">Delete</button>;
            }
		} else {
			return <button disabled type="button" onClick={props.deleteObject} className="btn btn-danger">Delete</button>;
		}
	}

	useEffect(()=> {
		setState(getUserPrivilege());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

    return (
        state
    );
}

export default DeleteButton;