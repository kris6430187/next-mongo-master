"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  async function fetchProducts() {
    const data = await fetch(`${apiBaseUrl}/product`);
    const p = await data.json();
    setProducts(p);
  }

  async function fetchCategory() {
    const data = await fetch(`${apiBaseUrl}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const createProduct = (data) => {
    fetch(`${apiBaseUrl}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    
    await fetch(`${apiBaseUrl}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  const columns = [
    { field: 'code', headerName: 'Code', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'price', headerName: 'Price', width: 100 },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      valueGetter: (params) => {
        const categoryObj = category.find(c => c._id === params.value);
        return categoryObj ? categoryObj.name : '';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={deleteById(params.id)}>
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-2xl">Product Management</h1>
        <Link href="/">
          <Button variant="contained" color="primary">
            Back to Main Page
          </Button>
        </Link>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64">
          <form onSubmit={handleSubmit(createProduct)}>
            <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
              <div>Code:</div>
              <div>
                <input
                  name="code"
                  type="text"
                  {...register("code", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Description:</div>
              <div>
                <textarea
                  name="description"
                  {...register("description", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Price:</div>
              <div>
                <input
                  name="price"
                  type="number"
                  {...register("price", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Category:</div>
              <div>
                <select
                  name="category"
                  {...register("category", { required: true })}
                  className="border border-black w-full"
                >
                  {category.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="submit"
                  value="Add"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Products ({products.length})</h1>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}