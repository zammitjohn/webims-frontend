import { useContext } from 'react';
import { UserPrivilegesContext } from "./ProtectedRoute";

function DeleteButton(props) {
	const privileges = useContext(UserPrivilegesContext);
	return <button disabled={!privileges.canDelete} type="button" onClick={props.deleteObject} className="btn btn-danger">Delete</button>
}

export default DeleteButton;