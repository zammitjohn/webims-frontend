import { useContext } from 'react';
import { UserPrivilegesContext } from "./ProtectedRoute";

function UpdateButton() {
	const privileges = useContext(UserPrivilegesContext);
	return <button disabled={!privileges.canUpdate} type="submit" className="btn btn-primary">Update</button>;
}

export default UpdateButton;
