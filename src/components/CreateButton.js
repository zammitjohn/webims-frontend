function CreateButton() {
	if ((localStorage.getItem('Privileges'))) {
		if (JSON.parse(localStorage.getItem('Privileges'))[0].canCreate === true) {
			return <button type="submit" className="btn btn-primary">Create</button>;
		} else {
			return <button disabled type="submit" className="btn btn-primary">Create</button>;
		}
	} else {
		return <button disabled type="submit" className="btn btn-primary">Create</button>;
	}
}

export default CreateButton;
