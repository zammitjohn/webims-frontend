import { useContext } from 'react';
import { UserPrivilegesContext } from "./ProtectedRoute";

function CreateButton() {
	const privileges = useContext(UserPrivilegesContext);
	return <button disabled={!privileges.canCreate} type="submit" className="btn btn-primary">Create</button>
}

export default CreateButton;