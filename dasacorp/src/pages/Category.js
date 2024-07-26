/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Form, Input, Button, message, Breadcrumb } from "antd";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const Category = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/categories/${categoryId}`
      );
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error("Erro ao buscar categoria.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategory(id);
    }
  }, [id]);

  const onFinish = async (values) => {
    try {
      if (id) {
        await axios.put(`http://localhost:8001/api/categories/${id}`, {
          ...values,
          ownerId: 1,
        });
        message.success("Categoria atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:8001/api/categories", {
          ...values,
          ownerId: 1,
        });
        message.success("Categoria adicionada com sucesso!");
      }
      form.resetFields();
      navigate("/categories");
    } catch (error) {
      message.error("Erro ao salvar categoria.");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Catálogo</Link>,
          },
          {
            title: <Link to="/categories">Categorias</Link>,
          },
          {
            title: id ? "Atualizar Categoria" : "Criar Categoria",
          },
        ]}
      />
      <Form
        layout="vertical"
        form={form}
        name="category-form"
        onFinish={onFinish}
        className="mt-10"
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: "Por favor insira o título" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: "Por favor insira a descrição" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? "Atualizar" : "Criar"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Category;
