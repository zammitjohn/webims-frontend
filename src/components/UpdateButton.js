import { useContext } from 'react';
import { UserPrivilegesContext } from "./ProtectedRoute";
import { Button } from 'react-bootstrap';

function UpdateButton() {
	const privileges = useContext(UserPrivilegesContext);
	return <Button disabled={!privileges.canUpdate} type="submit" variant="primary">Update</Button>
}

export default UpdateButton;
