"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
 
export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  let idToBeUpdated = null;
  const { register, handleSubmit, setValue, reset } = useForm();
 
  async function fetchCategory() {
    const data = await fetch(`${apiBaseUrl}/category`);
    const c = await data.json();
    setCategoryList(c);
  }
 
  function startEdit(category) {
    console.log(category)
    // setValue("name", category.name)
    // reset({ name: category.name })
    reset(category)
    // idToBeUpdated = category._id;
    setUpdateForm(true)
  }
 
 
  useEffect(() => {
    fetchCategory();
  }, []);
 
  function createOrUpdateCategory(data) {
    if (updateForm) {
      // data._id = idToBeUpdated
      console.log("createOrUpdateCategory",data)
      // Update the category
      fetch(`${apiBaseUrl}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => fetchCategory());
  
      return
    }
 
 
    fetch(`${apiBaseUrl}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset()
      fetchCategory()
    });
 
  }
 
  return (
    <main>
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
                {...register("order", { default:0, required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value={updateForm ? "Update" : "Add"}
                className={"italic text-white font-bold py-2 px-4 rounded-full "+(updateForm ? " bg-blue-800 hover:bg-blue-700" : " bg-green-800 hover:bg-green-700")}
              />
            </div>
 
            <div className="col-span-2">
              {
                updateForm && (
                  <button
                    onClick={() => {
                      reset({name:"",order:0})
                      setUpdateForm(false)
                    }}
                    className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >Cancel</button>
                )
              }
            </div>
          </div>
        </form>
      </div>
      <div>
        <h1>Category ({categoryList.length})</h1>
        {categoryList.map((category) => (
          <div key={category._id}>
            <button className="border border-black mx-2 px-2" onClick={() => startEdit(category)}>Edit</button>
            <Link href={`/product/category/${category._id}`} className="text-red-600">
              {category.name}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}