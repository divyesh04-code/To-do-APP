import { useState } from 'react'
import '../style/addtask.css'
import { useNavigate } from 'react-router-dom';
export default function AddTask(){
    const [taskData, setTaskData] = useState('');
    const navigate=useNavigate('');

    const handleAddTask = async ()=>{
        console.log(taskData);
        let result= await fetch('http://localhost:4000/add-task',{
            method:'Post',
            body:JSON.stringify(taskData),
            headers:{
                'Content-type':'Application/Json'
            }
        })
        result= await result.json()
        if(result){
            navigate("/");
            console.log("New Task added");
        }
    }

    return(
        <div className="container">
            <h1>Add New Task</h1>
                <label htmlFor="">Title</label>
                <input onChange={(event)=>setTaskData({...taskData,title:event.target.value})} type="text" name="title" placeholder="Enter task title"/>
                <label htmlFor="">Description</label>
                <textarea onChange={(event)=>setTaskData({...taskData,description:event.target.value})} rows={4} name="description" placeholder="Enter task description " id=""></textarea>
                <button onClick={handleAddTask} className="submit">Add New Task</button>
        </div>
    )
}
