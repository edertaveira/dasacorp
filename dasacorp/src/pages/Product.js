import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, message, Breadcrumb } from "antd";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const Product = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/products/${productId}`
      );
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error("Erro ao buscar produto.");
    }
  };

  const onFinish = async (values) => {
    try {
      if (id) {
        await axios.put(`http://localhost:8001/api/products/${id}`, {
          ...values,
          ownerId: 1,
        });
        message.success("Produto atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:8001/api/products", {
          ...values,
          ownerId: 1,
        });
        message.success("Produto adicionado com sucesso!");
      }
      form.resetFields();
      navigate("/");
    } catch (error) {
      message.error("Erro ao salvar produto.");
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
            title: id ? "Atualizar Produto" : "Criar Produto",
          },
        ]}
      />
      <Form
        layout="vertical"
        form={form}
        name="product-form"
        onFinish={onFinish}
        initialValues={{ price: 0 }}
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
        <Form.Item
          label="Preço"
          name="price"
          rules={[{ required: true, message: "Por favor insira o preço" }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            style={{ width: "100%" }}
          />
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

export default Product;
