function UpdateButton() {
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

export default UpdateButton;
