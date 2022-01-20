function DeleteButton(props) {
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
export default DeleteButton;
