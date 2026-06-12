import { Fragment, useEffect, useState } from "react";
import '../style/list.css';
import { Link } from "react-router-dom";

export default function List() {
    const [taskData, setTaskData] = useState([]);

    // Jaise hi component load hoga, yeh apne aap getListData() ko call kar dega.
    useEffect(() => {
        getListData();
    }, []);

    const getListData = async () => {
        let list = await fetch('http://localhost:4000/tasks');
        list = await list.json()
        if (list.success) {
            setTaskData(list.result)
        }
    }

    const deleteTask = async (id) => {
        let item = await fetch('http://localhost:4000/delete/' + id, { method: 'delete' });
        item = await item.json()
        if (item.success) {
            getListData();
        }
    }

    return (
        <div>
            <h1>To Do List</h1>
            <ul className="task-list">
                <li className="list-header">S.No</li>
                <li className="list-header">Title</li>
                <li className="list-header">Description</li>
                <li className="list-header">Action</li>


                {taskData && taskData.map((item, index) => (
                    <Fragment key={item.id}>
                        <li className="list-item">{index + 1}</li>
                        <li className="list-item">{item.title}</li>
                        <li className="list-item">{item.description}</li>
                        <li className="list-item">
                            <button onClick={() => deleteTask(item.id)} className="delete-item">Delete</button>
                            <Link to={"update/" + item.id} className="update-item">Update</Link>
                        </li>
                    </Fragment>
                ))}
            </ul>
        </div>
    );
}


