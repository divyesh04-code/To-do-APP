import express from "express"; 

// Humne jo dbconfig.js file banayi hai, wahan se table ka naam aur connection function mangwa rahe hain.
// Taaki hum is file se MySQL database se baat kar sakein.
import { tableName, connection } from "./dbconfig.js"; 
import cors from 'cors';

// Express ko start karke 'app' naam ke variable mein save kar rahe hain.
// Ab hum is 'app' ka use karke hi saare routes banayenge.
const app = express();

// Yeh line bahut zaroori hai! Frontend (React) se data JSON format mein aayega.
// Agar yeh line nahi likhenge, toh Node.js ko frontend ka data samajh nahi aayega aur req.body undefined aayega.
app.use(express.json());

app.use(cors());

// Naya Task Add karne ke liye (CREATE)
app.post("/add-task", async (req, resp) => {
    // 'try' block code ko crash hone se bachata hai. Agar koi error aayi, toh seedha 'catch' me jayega.
    try {
        // Database se connection mangwa rahe hain. 'await' lagaya taaki connection hone tak code aage na badhe.
        const db = await connection(); 
        
        // Frontend se aane wale data (req.body) mein se title aur description nikal rahe hain.
        const title = req.body.title; 
        const description = req.body.description;

        const query = `INSERT INTO ${tableName} (title, description) VALUES (?, ?)`;
        
        const [result] = await db.execute(query, [title, description]);

        
        if (result.affectedRows > 0) {
            resp.send({ message: "new task added", success: true, result });
        } else {
            resp.send({ message: "task not added", success: false });
        }
        
    } catch (error) {
        console.error("Error adding task:", error); 
        resp.status(500).send({ message: "Database error occurred", success: false });
    }
});

// API 3: Saare Tasks nikalne ke liye (READ / GET)
app.get("/tasks", async (req, resp) => {
    try {
        // Database se connection mangwa rahe hain
        const db = await connection();

        const query = `SELECT * FROM ${tableName}`;

        // Query ko execute kar rahe hain. 
        // Result array mein aayega, jisme hamare saare tasks honge.
        const [result] = await db.execute(query);

        // Agar result aa gaya, toh frontend ko bhej do
        if (result) {
            resp.send({ message: "task list fetched", success: true, result });
        } else {
            resp.send({ message: "error try after sometime", success: false });
        }

    } catch (error) {
        console.error("Error fetching tasks:", error);
        resp.status(500).send({ message: "Database error occurred", success: false });
    }
});

// Ek single task nikalne ke liye (GET by ID) - Update ke liye
app.get("/task/:id", async (req, resp) => {
    try {
        const db = await connection();
        
        // URL me se ID nikal rahe hain
        const id = req.params.id;

        const query = `SELECT * FROM ${tableName} WHERE id = ?`;
        const [result] = await db.execute(query, [id]);

        // result hamesha ek array hota hai [ {task1} ]. 
        // Agar task mil gaya (length > 0), toh pehla item (result[0]) bhej do.
        if (result.length > 0) {
            resp.send({ message: 'task fetched', success: true, result: result[0] });
        } else {
            resp.send({ message: 'error try after sometime', success: false });
        }

    } catch (error) {
        console.error("Error fetching single task:", error);
        resp.status(500).send({ message: "Database error occurred", success: false });
    }
});


app.put("/update-task", async (req, resp) => {
    try {
        const db = await connection();
        
        // Frontend se aane wale data se id, title, aur description nikal rahe hain
        const { id, title, description } = req.body;

        const query = `UPDATE ${tableName} SET title = ?, description = ? WHERE id = ?`;
        
        const [result] = await db.execute(query, [title, description, id]);

        if (result.affectedRows > 0) {
            resp.send({ message: 'task data updated', success: true, result });
        } else {
            resp.send({ message: 'task not found or no changes made', success: false });
        }

    } catch (error) {
        console.error("Error updating task:", error);
        resp.status(500).send({ message: "Database error occurred", success: false });
    }
});

app.delete("/delete/:id", async (req, resp) => {
    try {
        const db = await connection();
        
        // URL se ID nikalo (Jaise /delete/5 me se 5 nikalega)
        const id = req.params.id; 

        const query = `DELETE FROM ${tableName} WHERE id = ?`;
        
        // Query execute karna (id ko array [id] me bhejte hain taaki hacking/SQL injection na ho)
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows > 0) {
            resp.send({ message: 'task deleted', success: true, result });
        } else {
            resp.send({ message: 'task not found or already deleted', success: false });
        }

    } catch (error) {
        console.error("Error deleting task:", error);
        resp.status(500).send({ message: "Database error occurred", success: false });
    }
});


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});