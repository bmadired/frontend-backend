import React from "react";
import axios from "axios";
export default function ExpenseList({expenses,token,refresh}){
 const del=async(id)=>{
  await axios.delete(`http://localhost:5000/api/expenses/${id}`,{headers:{Authorization:`Bearer ${token}`}});
  refresh();
 };
 return(<div>{expenses.map(e=>
  <div key={e._id}>
   <p>{e.title} - ${e.amount} - {e.category}</p>
   <button onClick={()=>del(e._id)}>Delete</button>
  </div>)}
 </div>);
}