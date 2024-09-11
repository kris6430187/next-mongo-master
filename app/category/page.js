"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from '@mui/material';

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "order", headerName: "Order", width: 200 },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => params.row.startEdit(params.row)}
          style={{ marginRight: 8 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => params.row.deleteCategory(params.row.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const [categoryBeingEdited, setCategoryBeingEdited] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${apiBaseUrl}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return { ...category, id: category._id, startEdit, deleteCategory };
    });
    setCategoryList(c2);
  }

  function startEdit(category) {
    reset(category);
    setCategoryBeingEdited(category);
    setUpdateForm(true);
  }

  function deleteCategory(categoryId) {
    fetch(`${apiBaseUrl}/category/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      fetchCategory();
      setUpdateForm(false);
      setCategoryBeingEdited(null);
    });
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function createOrUpdateCategory(data) {
    if (updateForm) {
      fetch(`${apiBaseUrl}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, _id: categoryBeingEdited._id }),
      }).then(() => {
        fetchCategory();
        setUpdateForm(false);
        setCategoryBeingEdited(null);
      });

      return;
    }

    fetch(`${apiBaseUrl}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset();
      fetchCategory();
    });
  }

  return (
    <main>
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-2xl">Category Management</h1>
        <Link href="/">
          <Button variant="contained" color="primary">
            Back to Main Page
          </Button>
        </Link>
      </div>
      <div className="border border-black w-[50%] m-4">
        <form onSubmit={handleSubmit(createOrUpdateCategory)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4">
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div>Order:</div>
            <div>
              <input
                name="order"
                type="number"
                {...register("order", { default: 0, required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value={updateForm ? "Update" : "Add"}
                className={
                  "italic text-white font-bold py-2 px-4 rounded-full " +
                  (updateForm
                    ? " bg-blue-800 hover:bg-blue-700"
                    : " bg-green-800 hover:bg-green-700")
                }
              />
            </div>

            <div className="col-span-2">
              {updateForm && (
                <>
                  <button
                    onClick={() => {
                      reset({ name: "", order: 0 });
                      setUpdateForm(false);
                      setCategoryBeingEdited(null);
                    }}
                    className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteCategory(categoryBeingEdited._id)}
                    className="italic bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-2"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
      <div>
        <DataGrid
          rows={categoryList}
          columns={columns}
        />
        {/* <h1>Category ({categoryList.length})</h1>
        {categoryList.map((category) => (
          <div key={category._id}>
            <button
              className="border border-black mx-2 px-2"
              onClick={() => startEdit(category)}
            >
              Edit
            </button>
            <Link
              href={`/product/category/${category._id}`}
              className="text-red-600"
            >
              {category.name}
            </Link>
          </div>
        ))} */}
      </div>
    </main>
  );
}