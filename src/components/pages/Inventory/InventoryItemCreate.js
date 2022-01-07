import React, {Component} from 'react';
import ContentHeader from '../../ContentHeader';
import LoadCategoriesDropdown from './LoadCategoriesDropdown';
import LoadTypesDropdown from './LoadTypesDropdown';

class InventoryItemCreate extends Component {
    constructor(props) {
      super(props);
      this.pageName = 'Add item'
      this.state = { 
        SKU: '',
        category: undefined,
        type: undefined,
        description: '',
        supplier: '',
        qty: '',
        qtyIn: '',
        qtyOut: '',
        notes: '',
      }
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      const target = event.target;
      const name = target.id;
      const value = target.value;

      this.setState({ 
        [name]: value
      });
    }
  
    handleSubmit(event) {
      event.preventDefault();
 
      (async () => {
        async function submitForm() {
          const response = await fetch('http://site.test/WebIMS/api/inventory/categories/read', {
            method: 'GET',
            credentials: 'include'
            });
          const categories = await response.json();
          return categories;
        }
        const category = await submitForm();
        console.log(category);
        //alert('Your favorite flavor is: ' + this.state.SKU);
      })();
      
    }
  
    render() {
      return (
        <>
          <ContentHeader pageName={this.pageName}/>
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  {/* general form elements */}
                  <div className="card">

                    {/* form start */}
                    <form id="item_form" onSubmit={this.handleSubmit}>
                      <div className="card-body">

                        <div className="form-group">
                          <label htmlFor="SKU">SKU</label>
                          <input value={this.state.SKU} onChange={this.handleChange} type="text" maxLength="255" className="form-control" id="SKU" placeholder="Enter SKU"/>
                        </div>
                        
                        <div className="form-group">
                          <div className="row">
                            <div className="col-6 col-sm-3">
                              <label htmlFor="category">Category</label>
                              <select value={this.state.category} onChange={this.handleChange} id="category" className="form-control">
                                <LoadCategoriesDropdown/>
                              </select>
                            </div>
                            <div className="col-6 col-sm-3">
                              <label htmlFor="type">Type</label>
                              <select value={this.state.type} onChange={this.handleChange} id="type" className="form-control">
                                <LoadTypesDropdown category={this.state.category}/>
                              </select>
                            </div>
                          </div>
                        </div>                 

                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <input value={this.state.description} onChange={this.handleChange} type="text" maxLength="255" className="form-control" id="description" placeholder="Enter description"/>
                        </div>

                        <div className="form-group">
                          <label htmlFor="supplier">Supplier</label>
                          <input value={this.state.supplier} onChange={this.handleChange} type="text" maxLength="255" className="form-control" id="supplier" placeholder="Enter supplier"/>
                        </div>              

                        <div className="row">
                          <div className="col-sm-6">
                            <div className="form-group">
                              <label htmlFor="qty">Quantity</label>
                              <input value={this.state.qty} onChange={this.handleChange} type="number" min="0" max="9999" className="form-control" id="qty" placeholder="Enter quantity"/>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="form-group">
                              <label htmlFor="qtyIn">Provisional In</label>
                              <input value={this.state.qtyIn} onChange={this.handleChange} type="number" min="0" max="9999" className="form-control" id="qtyIn" placeholder="Enter quantity"/>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="form-group">
                            <label htmlFor="qtyOut">Provisional Out</label>
                            <input value={this.state.qtyOut} onChange={this.handleChange} type="number" min="0" max="9999" className="form-control" id="qtyOut" placeholder="Enter quantity"/>
                            </div>
                          </div>
                        </div>
                          
                        <div className="form-group">
                          <label htmlFor="notes">Miscellaneous</label>
                          <input value={this.state.notes} onChange={this.handleChange} type="text" maxLength="255" className="form-control" id="notes" placeholder="Notes"/>
                        </div>

                      </div>
                      {/* /.card-body */}
                      
                      <div className="card-footer">
                        <button type="submit" className="btn btn-primary button_action_create">Submit</button>
                      </div>
                    </form>
                  </div>
                  {/* /.card */}
                </div>
              </div>
              {/* /.row */}
            </div>{/* /.container-fluid */}
          </section>      
        </>

      );
    }
  }

export default InventoryItemCreate;
