import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Breadcrumb } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/api/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Erro ao buscar categorias.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8001/api/categories/${id}`);
      message.success("Categoria excluída com sucesso!");
      fetchCategories();
    } catch (error) {
      message.error("Erro ao excluir categoria.");
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => navigate(`/category/${record.id}`)}
            type="link"
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta categoria?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link" danger>
              Excluir
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Catálogo</Link>,
          },
          {
            title: "Categorias",
          },
        ]}
      />

      <div className="my-4">
        <Link
          className="py-2 px-3 rounded-md bg-blue-800 text-white"
          to="/category"
        >
          Nova Categoria
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />
    </>
  );
};

export default Categories;
