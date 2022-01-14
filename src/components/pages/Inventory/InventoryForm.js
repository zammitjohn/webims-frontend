function InventoryForm(props) {    
	return (
        <>                  
            <div className="form-group">
                <label htmlFor="SKU">SKU</label>
                <input value={props.values.SKU} onChange={props.handleChange} type="text" maxLength="255" className="form-control" id="SKU" placeholder="Enter SKU"/>
            </div>

            <div className="form-group">
                <div className="row">
                    <div className="col-6 col-sm-3">
                    <label htmlFor="category">Category</label>
                    <select value={props.values.category} onChange={props.handleCategoryChange} id="category" className="form-control">
                        <option value='null'>Select Category</option>
                        {props.categories.map(category => (
                            <option key={category.id} value={category.id}>
                            {category.name}
                            </option>
                        ))}    
                    </select>                          
                    </div>
                    <div className="col-6 col-sm-3">
                    <label htmlFor="type">Type</label>
                    <select value={props.values.type} onChange={props.handleChange} id="type" className="form-control">
                        <option value='null'>Select Type</option>
                        {props.types.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                        ))}  
                    </select>
                    </div>
                </div>
                </div>                   

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input value={props.values.description} onChange={props.handleChange} type="text" maxLength="255" className="form-control" id="description" placeholder="Enter description"/>
            </div>

            <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input value={props.values.supplier} onChange={props.handleChange} type="text" maxLength="255" className="form-control" id="supplier" placeholder="Enter supplier"/>
            </div>              

            <div className="row">
                <div className="col-sm-6">
                <div className="form-group">
                    <label htmlFor="qty">Quantity</label>
                    <input value={props.values.qty} onChange={props.handleChange} type="number" min="0" max="9999" className="form-control" id="qty" placeholder="Enter quantity"/>
                </div>
                </div>
                <div className="col-sm-3">
                <div className="form-group">
                    <label htmlFor="qtyIn">Provisional In</label>
                    <input value={props.values.qtyIn} onChange={props.handleChange} type="number" min="0" max="9999" className="form-control" id="qtyIn" placeholder="Enter quantity"/>
                </div>
                </div>
                <div className="col-sm-3">
                <div className="form-group">
                <label htmlFor="qtyOut">Provisional Out</label>
                <input value={props.values.qtyOut} onChange={props.handleChange} type="number" min="0" max="9999" className="form-control" id="qtyOut" placeholder="Enter quantity"/>
                </div>
                </div>
            </div>
                
            <div className="form-group">
                <label htmlFor="notes">Miscellaneous</label>
                <input value={props.values.notes} onChange={props.handleChange} type="text" maxLength="255" className="form-control" id="notes" placeholder="Notes"/>
            </div>            
        </>
   );

}

export default InventoryForm;