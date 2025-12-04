import React,{useState} from "react";
import axios from "axios";
export default function ExpenseForm({token,refresh}){
 const[title,setTitle]=useState(""); const[amount,setAmount]=useState("");
 const[category,setCategory]=useState("");
 const add=async(e)=>{
  e.preventDefault();
  await axios.post("http://localhost:5000/api/expenses",{title,amount,category},{headers:{Authorization:`Bearer ${token}`}});
  setTitle("");setAmount("");setCategory("");refresh();
 };
 return(<form onSubmit={add}>
 <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)}/>
 <input placeholder="amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
 <input placeholder="category" value={category} onChange={e=>setCategory(e.target.value)}/>
 <button>Add</button></form>);
}