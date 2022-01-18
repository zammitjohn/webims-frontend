import React, { useState, useEffect } from 'react';

function CreateButton() {

	const [state, setState] = useState('')

	function getUserPrivilege() {
		if ((localStorage.getItem('Privileges'))) {
            if (JSON.parse(localStorage.getItem('Privileges'))[0].canCreate === true) {
                return <button type="submit" className="btn btn-primary">Create</button>;
            } else {
                return <button disabled type="submit" className="btn btn-primary">Create</button>;
            }
		} else {
			return <button disabled type="submit" className="btn btn-primary">Create</button>;
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

export default CreateButton;