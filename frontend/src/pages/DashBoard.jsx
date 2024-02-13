import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
const DashBoard = () => {
    const [dept, setDept] = useState([]);
    const navigate = useNavigate();
    const fetchData = async() => {
        // setDept(["IT", "CSE", "CSBS", "AIDS", "ECE"]);
        try{
        const res = await fetch("http://localhost:5000/all_dept");
        if(res.status===200){
            const data = await res.json();
            console.log(data);
            setDept(data);
        }
        }catch(err){
            console.log("error" + err.message)
        }
    };

    useEffect(()=>{
        fetchData();
    }, []);

  return (
    <div className='dashboard'>
        <div className='dept_container'>
            <h1>Departments</h1>
            <div className='depts'>
                {dept.map((d)=>{
                    return(
                    <div id={d.name} key={d.id} onClick={()=> navigate(`/dept/${d.id}`)}className="dept_card">
                        <h3>{d.name}</h3>
                        <div className='dept_details'>
                            {/* <p>Faculty: 10</p> */}
                            <p>Students: {d.student_count}</p>
                        </div>
                    </div>)
                })}
            </div>
        </div>
    </div>
  )
}

export default DashBoard