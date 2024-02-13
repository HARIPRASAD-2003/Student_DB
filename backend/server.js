const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const {executeQuery} = require('./db');




const app = express();
app.use(cors());
app.use(express.json());


app.get('/all_dept', async(req, res)=>{
    try{
        let result= await executeQuery("SELECT d.*, COUNT(s.id) AS student_count FROM dept AS d LEFT JOIN Student AS s ON s.dept_id = d.id GROUP BY d.id;");
        console.log(result);
        res.status(200).send(result);
    }catch(error){
        console.log(`Error in getting all departments : ${error}`);
        res.status(500).send({message: "Internal Server Error"});
    }
});


app.post("/add_department",async (req,res) => {
    const {dept_name}= req.body;
    
    try{
    if(!dept_name){
        return res.status(400).send({message:"Dept Name is required!"});
    }else{
        const result=await executeQuery(`INSERT INTO dept VALUES ('${dept_name}')`);
        res.status(200).send({message:"Department added successfully!"});
    }}catch(error){
        console.log(`Error in adding department : ${error}`);
        res.status(500).send({message: "not successfull"});
    }
});


app.get('/students/:id/:start', async(req, res)=>{
    const {id, start}= req.params;
    try{
        console.log(id);
        let query = `Select * from student where dept_id=${id}`;
        if(start!=='undefined' || start!==''){query +=` and LOWER(name) LIKE LOWER('%${start}%') Order by reg_no`;}
        console.log(query);
        const response = await executeQuery(query);
        console.log(response);
        res.status(200).send(response);
    }catch{
        res.status(500).send({message: "not suck"});
    }
});

app.get('/students/:id', async(req, res)=>{
    const {id}= req.params;
    try{
        console.log(id);
        let query = `Select * from student where dept_id=${id} Order by reg_no`;
        // if(start!=='undefined' || start!==''){query +=` and LOWER(name) LIKE LOWER('%${start}%')`;}
        console.log(query);
        const response = await executeQuery(query);
        console.log(response);
        res.status(200).send(response);
    }catch{
        res.status(500).send({message: "not suck"});
    }
});


app.post('/add_std', async(req, res)=> {
    const {name, dept_id, age, adr, cgpa, email, reg_no} = req.body;
    try {
        const response = await executeQuery(`INSERT INTO student(name, dept_id, age, adr, cgpa, email, reg_no) VALUES("${name}", ${dept_id}, ${age}, "${adr}", ${cgpa}, "${email}", "${reg_no}")`);
        console.log(response);
        res.status(200).send({message: "succesful"});
    } catch (error) {
        res.status(500).send({message: error});
    }
});


app.post('/update/:id', async(req, res)=>{
    const {name, dept_id, age, adr, cgpa, email, reg_no} = req.body;
    const id = req.params.id;
    console.log(id);
    try {
        const response = await executeQuery(`UPDATE student SET name="${name}", dept_id=${dept_id}, age=${age}, adr="${adr}", cgpa=${cgpa}, email="${email}", reg_no="${reg_no}" where id=${id}`);
        console.log(response);
        res.status(200).send({message: "succesful"});
    } catch (error) {
        res.status(500).send({message: error});
    }
})

app.post('/delete_Std', async(req, res)=>{
    console.log(req.body);
    const {ids} = req.body;
    try {
        for(let i of ids){
            const response = await executeQuery(`delete from student where id=${i}`);
            console.log(i, response);
        }
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(500).json({message: "Not Authenticated"});
    }
});


const port = process.env.PORT || 5000; 
app.listen(port, ()=>{
    console.log("server runing on port: ", port);
})