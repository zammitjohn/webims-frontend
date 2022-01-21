import React, { useState, useEffect } from 'react';

function CreateButton() {

	const [state, setState] = useState('')

	function getUserPrivilege() {
		if ((localStorage.getItem('Privileges'))) {
            if (JSON.parse(localStorage.getItem('Privileges')).canCreate === true) {
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
	// eslint-disable-next-line react-hooks/exhaustive-deps	
	},[])

    return (
        state
    );
}

export default CreateButton;
