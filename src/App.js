// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Layout from "./components/Layout";
import Error404 from "./components/pages/Error404";
import Content from "./components/pages/Content";
import CreateInventoryItem from './components/pages/Inventory/CreateInventoryItem';
import EditInventoryItem from './components/pages/Inventory/EditInventoryItem';
import AllInventoryItems from './components/pages/Inventory/AllInventoryItems';
import CategoryInventoryItems from "./components/pages/Inventory/CategoryInventoryItems";
import TypeInventoryItems from "./components/pages/Inventory/TypeInventoryItems";
import Login from "./components/Login";

function App() {
	return (
		<>
			<BrowserRouter>
			<Routes>
				<Route path="login" element={<Login/>} />
				<Route element={<ProtectedRoute/>}>

					<Route path="/" element={<Layout/>}>
						<Route index element={<Content/>} />

						<Route path="dashboard" element={<Content/>} />
						<Route path="webims" element={<Content/>} />
						
						<Route path="inventory">
							<Route path='' element={<AllInventoryItems/>} />
							<Route path='category/:id' element={<CategoryInventoryItems/>} />
							<Route path='type/:id' element={<TypeInventoryItems/>} />
							<Route path='create' element={<CreateInventoryItem/>} />
							<Route path='edit/:id' element={<EditInventoryItem/>} />
						</Route>

						<Route path="reports">
							<Route path='' element={<Content/>} />
							<Route path='create' element={<Content/>} />
							<Route path='edit/:id' element={<Content/>} />
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

				</Route>
				

			</Routes>
			</BrowserRouter>
		</>
	);
  }
  
  export default App;