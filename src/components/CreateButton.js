import { useContext } from 'react';
import { UserPrivilegesContext } from "./ProtectedRoute";
import { Button } from 'react-bootstrap';

function CreateButton() {
	const privileges = useContext(UserPrivilegesContext);
	return <Button disabled={!privileges.canCreate} type="submit" variant="primary">Create</Button>
}

export default CreateButton;