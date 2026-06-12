import mysql from 'mysql2/promise'; 

const dbConfig = {
    host: 'localhost',      
    user: 'root',           
    password: '',
    database: 'todoapp'     
};

export const tableName = "todos";

// Database connect karne ka function
export const connection = async () => {
    try {
        const connect = await mysql.createConnection(dbConfig);
        console.log("MySQL Database Connected Successfully!");
        return connect; // Yeh connection return karega jisse hum queries chala payenge
    } catch (error) {
        console.error("Database connection failed: ", error);
    }
};