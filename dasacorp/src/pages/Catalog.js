import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  message,
  Tooltip,
  Popconfirm,
} from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  PlusOutlined,
  SwapOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/products");
      setProducts(response.data.products);
    } catch (error) {
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const handleMoreClick = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleCategoryModalOpen = (product) => {
    setSelectedProduct(product);
    fetchCategories();
    setCategoryModalVisible(true);
  };

  const handleCategoryChange = async (categoryId) => {
    try {
      await axios.post("http://localhost:8001/api/products/associate", {
        productId: selectedProduct.id,
        categoryId,
      });
      message.success(
        `Categoria associada ao produto ${selectedProduct.title}`
      );
      setCategoryModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8001/api/products/${id}`);
      message.success("Produto excluído com sucesso!");
      fetchProducts();
    } catch (error) {
      message.error("Erro ao excluir produto.");
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Tírulo",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      render: (value) => {
        return `R$ ${value.replace(".", ",")}`;
      },
    },
    {
      title: "Categoria",
      dataIndex: "categoryTitle",
      key: "categoryTitle",
      render: (value, record) => {
        if (!value)
          return (
            <Button
              icon={<SwapOutlined />}
              type="link"
              onClick={() => handleCategoryModalOpen(record)}
            >
              Associar à Categoria
            </Button>
          );
        return value;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Tooltip title="Ver mais">
            <Button
              icon={<PlusOutlined />}
              type="link"
              onClick={() => handleMoreClick(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/product/${record.id}`)}
              type="link"
            />
          </Tooltip>
          <Tooltip title="Associar à Categoria">
            <Button
              icon={<SwapOutlined />}
              type="link"
              onClick={() => handleCategoryModalOpen(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja excluir este produto?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button icon={<DeleteOutlined />} type="link" danger></Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="my-4">
        <Link
          className="py-2 px-3 rounded-md bg-blue-800 text-white"
          to="/product"
        >
          Criar Novo Produto
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
      />
      <Modal
        visible={visible}
        title={selectedProduct ? selectedProduct.title : ""}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {selectedProduct && (
          <div>
            <p>
              <strong>Descrição:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Descrição Categoria:</strong>{" "}
              {selectedProduct.categoryDescription}
            </p>
          </div>
        )}
      </Modal>
      <Modal
        visible={categoryModalVisible}
        title={`Associar Categoria ao Produto ${
          selectedProduct ? selectedProduct.title : ""
        }`}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={() => handleCategoryChange(selectedProduct.id)}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Selecione uma categoria"
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.title}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Catalog;
