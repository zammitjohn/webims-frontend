import { useContext } from 'react';
import { UserPrivilegesContext } from "./ProtectedRoute";
import { Button } from 'react-bootstrap';

function DeleteButton(props) {
	const privileges = useContext(UserPrivilegesContext);
	return <Button disabled={!privileges.canDelete} type="button" onClick={props.deleteObject} variant="danger">Delete</Button>
}

export default DeleteButton;