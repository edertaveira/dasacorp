import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Catalog from "./pages/Catalog";
import { Layout, Menu } from "antd";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
const { Header, Content } = Layout;

function App() {
  const items = [
    {
      key: 1,
      label: <Link to="/">Catálogo</Link>,
    },
    {
      key: 2,
      label: <Link to="/categories">Categorias</Link>,
    },
  ];
  return (
    <Router>
      <Layout className="min-h-[100vh]">
        <Header
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
        </Header>
        <Content className="m-4 p-4 bg-white rounded-lg border border-gray-200">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/:id" element={<Category />} />
            {/* <Route path="/product/:id" element={<ProductForm />} />
        <Route path="/category" element={<CategoryForm />} />
        <Route path="/category/:id" element={<CategoryForm />} /> */}
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
