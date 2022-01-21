import React, { useState, useEffect } from 'react';

function UpdateButton() {

	const [state, setState] = useState('')

	function getUserPrivilege() {
		if ((localStorage.getItem('Privileges'))) {
            if (JSON.parse(localStorage.getItem('Privileges'))[0].canUpdate === true) {
                return <button type="submit" className="btn btn-primary">Update</button>;
            } else {
                return <button disabled type="submit" className="btn btn-primary">Update</button>;
            }
		} else {
			return <button disabled type="submit" className="btn btn-primary">Update</button>;
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

export default UpdateButton;
