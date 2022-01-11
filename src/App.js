// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Error404 from "./components/pages/Error404";
import Content from "./components/pages/Content";
import CreateInventoryItem from './components/pages/Inventory/CreateInventoryItem';
import AllInventoryItems from './components/pages/Inventory/AllInventoryItems';

function App() {
    return (
		<div>
			<BrowserRouter>
			  <Routes>
				<Route path="/" element={<Layout />}>
				  <Route index element={<Content/>} />

				  <Route path="dashboard" element={<Content/>} />
				  
				  <Route path="inventory">
				  	<Route path='' element={<AllInventoryItems/>} />
				  	<Route path='category/:id' element={<Content/>} />
					<Route path='type/:id' element={<Content/>} />
					<Route path='create' element={<CreateInventoryItem/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="reports">
				  	<Route path='' element={<Content/>} />
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="projects">
				  	<Route path='edit/:id' element={<Content/>} />
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="registry">
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="*" element={<Error404 />} />
				</Route>
			  </Routes>
			</BrowserRouter>
		</div>
    );
  }
  
  export default App;