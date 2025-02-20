const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const port = 8000;

app.use(bodyParser.json());
let users = [];
let conn = null

const initMySQL = async() => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820
    })
}

/*
app.get('/testdbnew', async(req, res) => {
    try{
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0])
    } catch(error){
        console.log('error', error.message)
        res.status(500).json({error: 'Error fetching users'})
    }
})
*/
// path: GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// path: POST /user ใช้สำหรับสร้างข้อมูล user ใหม่
app.post('/users', async (req, res) => {
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user)
    console.log('results', results)
    res.json({
        message: 'Create user successfully',    
        data: results[0]
    })
})

// path: GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    // ค้นหา users หรือ index ที่ต้องการดึงข้อมูล
    let selectedIndex = users.findIndex(user => user.id == id)
    res.json(users[selectedIndex])
})

//path: PUT /users/:id สำหรับแก้ไข users รายคน(ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    let selectedIndex = users.findIndex(user => user.id == id)
        users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].filtername
        users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
        users[selectedIndex].age = updateUser.age || users[selectedIndex].age
        users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender
    res.json({
        message : 'Update user successfully',
        data: {
            user: updateUser,
            indexUpdated: selectedIndex
        }
    })
})

//path : DELETE /users/id: สำหรับลบ users รายคน(ตาม id ที่บันทึกเช้าไป)
app.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการจะลบ
    let selectedIndex = users.findIndex(user => user.id == id)
    //ลบ
    users.splice(selectedIndex, 1)
     res.json({
        message: 'Delete user successfully',
        indexDeleted: selectedIndex
     })
})

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('Http Server is running on port' + port)
});

/*
1.Get /users สำหรับ get users ทั้งหมดที่บันทึกไว้
2.POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
3.GET /users/:id สำหรับดึง users รายคนออก
4.PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
5.DELETE /users/id: สำหรับลบ users รายคน (ตาม id ที่บันทึกเช้าไป)
*/

/*const http = require('http'); // import node.js core module

const host = 'localhost'; // localhost
const port = 8000; // port number

//เมื่อเปิดเว็บไปที่ http://localhost:8000/ จะเรียกใช้งาน function requireListener
const requireListener = function (req, res) {
    res.writeHead(200);
    res.end('My first server!');
}

const server = http.createServer(requireListener);
server.listen(port,host,()=>{
    console.log(`Server is running on http://${host}:${port}/`); 
});
*/
