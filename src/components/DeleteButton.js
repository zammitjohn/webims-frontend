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

		//event local storage value changes
		function handleChangeStorage() {
			setState(getUserPrivilege());
		}
		window.addEventListener('storage', handleChangeStorage);
		return () => window.removeEventListener('storage', handleChangeStorage)

	},[])

    return (
        state
    );
}

export default DeleteButton;
