import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Students.css';

const Students = () => {
  const [data, setData] = useState([]);
  const [s_name, set_name] = useState("");
  const [s_age, set_age] = useState("");
  const [s_adr, set_adr] = useState("");
  const [s_cgpa, set_cgpa] = useState("");
  const [s_email, set_email] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const dept = window.location.pathname.split('/')[2];
  const dd = ["", "IT", "CSE", "CSBS", "AIDS", "ECE", "EEE", "MECH", "MCT", "CIVIL", "BME"];
  const [update, setUpdate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [s_id, set_id] = useState('');
  const [s_reg_no, set_reg_no] = useState("");
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState("");

  const openModal = () => {
    setSelect(false);
    setUpdate(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    set_name("");
    set_cgpa("");
    set_age("");
    set_adr("");
    set_email("");
    set_id('');
    set_reg_no("");
    setShowEdit(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://student-db-server.onrender.com/students/${dept}/${search}`);
      if(sort==="asc"){
        var data=response.data;
        data.sort((a, b) => (a.cgpa > b.cgpa) ? 1 : -1);
        setData(data);
      }else if(sort==="desc"){
        var data=response.data;
        data.sort((a, b) => (a.cgpa > b.cgpa) ? -1 : 1);
        setData(data);
      }else{
        setData(response.data);
      }
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`https://student-db-server.onrender.com/add_Std`, {
        name: s_name, dept_id: dept, age: s_age, adr: s_adr, cgpa: s_cgpa, email: s_email, reg_no: s_reg_no
      });
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleSelect = () => {
    setSelectedData([]);
    setSelect(!select);
    setUpdate(false);
  };

  const handleDelete = async() => {
    try {
      if(selectedData.length===0){
        alert("No student is Selected!!");
        return;
      }
      const res = await axios.post("https://student-db-server.onrender.com/delete_Std", {ids: selectedData});
      if(res.status!==200){
        throw new Error("res not sucks");
      }
      alert('Deleted Successfully');
      fetchData();
      handleSelect();
    } catch (error) {
        alert(error);
        console.log(error);
    }
  };

  const handleUpdate = async() => {
    try{
       const res = await axios.post(`https://student-db-server.onrender.com/update/${s_id}`, {
        name: s_name, dept_id: dept, age: s_age, adr: s_adr, cgpa: s_cgpa, email: s_email, reg_no: s_reg_no
      })
    }catch(err){
      alert(err);
      console.log(err);
    }finally{
      fetchData();
      setUpdate(false);
      closeModal();
    }
  }
  
  const handleEdit = (d) => {
    set_name(d.name);
    set_age(d.age);
    set_adr(d.adr);
    set_cgpa(d.cgpa);
    set_email(d?.email);
    set_id(d.id);
    set_reg_no(d?.reg_no);
    setShowEdit(true);
  }

  useEffect(() => {
    fetchData();
  }, [dept, search, sort]);

  return (
    <div>
      <div className='div_table'>
        <h1>{dd[dept]} Department</h1>
        <div className='search-box'>
          <label htmlFor='search_name'>Search by Name</label>
          <input id='search_name' 
          type='text'
          value={search}
          placeholder='Search'
          onChange={(e)=>setSearch(e.target.value)}/>
          <p>Students: {data.length}</p>
        </div>
        <div className='top-container' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <button onClick={openModal} id="add_display">Add Student</button>
          {(select)&&<button onClick={handleDelete}>Delete Student</button>}
          {(!select)?<button onClick={handleSelect}>Select Student</button>:<button className='cancel' onClick={handleSelect} >Cancel</button>}
          {/* <Dropdown options={options} onChange={handleDepartment} /> */}
          {(!select) &&  <div>
          {(!update)?<button onClick={()=>setUpdate(!update)}>Update</button>:<button className='cancel' onClick={()=>setUpdate(!update)}>Cancel</button>}
          </div>}
          {<button onClick={()=>setGrid(!grid)}>{(!grid)?"grid":"box"}</button>}
          {/* {(update)&&<button onClick={handleUpdate}>Update</button>} */}
        </div>
        {(grid)?<table className='table'>
          <thead>
            <tr>
              {select && <th style={{width: '10px'}}>Selected</th>}
              <th>S.No</th>
              <th>Reg_No</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Address</th>
              <th>CGPA 
                <button className='simple-btn' onClick={()=>setSort((sort==="")?"asc":(sort==="asc")?"desc":"")}>{(sort==="")?"sort":(sort==="asc")?"🔽":"🔼"}</button>
              </th>
              {update && <th>Edit</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((d, ind) => (
              <tr key={d.id} onClick={() => {
                const updatedSelection = selectedData.includes(d.id)
                  ? selectedData.filter(itemId => itemId !== d.id)
                  : [...selectedData, d.id];
                setSelectedData(updatedSelection);
            }}>
                {select && <td style={{display: 'flex', justifyContent: 'center'}}><input type='checkbox' checked={selectedData.includes(d.id)} /></td>}
                <td>{ind + 1}</td>
                <td>{d?.reg_no}</td>
                <td>{d.name}</td>
                <td>{d.age}</td>
                <td>{d?.email}</td>
                <td>{d.adr}</td>
                <td>{d.cgpa}</td>
                {update && <td><button className='edit' onClick={()=>handleEdit(d)}>Edit</button></td>}
              </tr>
            ))}
          </tbody>
        </table>:
        <div className='card-container' style={{ paddingTop: '20px'}}>
        {data.map((d, ind) => (
          <div key={d.id} className='card' onClick={() => {
            const updatedSelection = selectedData.includes(d.id)
              ? selectedData.filter(itemId => itemId !== d.id)
              : [...selectedData, d.id];
            setSelectedData(updatedSelection);
          }}>
            {select && <div className='checkbox-container'><input type='checkbox' checked={selectedData.includes(d.id)} /></div>}
            <div className='card-content'>
              <div><b>S.No:</b> {ind + 1}</div>
              <div><b>Reg_No:</b> <p>{d?.reg_no}</p></div>
              <div><b>Name:</b> <p>{d.name}</p></div>
              <div><b>Age:</b> <p>{d.age}</p></div>
              <div><b>Email:</b> <p>{d?.email}</p></div>
              <div><b>Address:</b> <p>{d.adr}</p></div>
              <div><b>CGPA:</b> <p>{d.cgpa}</p></div>
              {update && <div><button className='edit' onClick={() => handleEdit(d)}>Edit</button></div>}
            </div>
          </div>
        ))}
      </div>
      
        }

      </div>
      {showModal &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Enter Student Details</h2>
            <label htmlFor='reg'>Reg_No:</label>
            <input
              type='text'
              id='reg'
              value={s_reg_no}
              onChange={(e) => set_reg_no(e.target.value)}
            />
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={s_name}
              onChange={(e) => set_name(e.target.value)}
            />
            <label htmlFor='age'>Age:</label>
            <input
              type='number'
              id='age'
              value={s_age}
              onChange={(e) => set_age(e.target.value)}
            />
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={s_email}
              onChange={(e) => set_email(e.target.value)}
            />
            <label htmlFor='adr'>Address:</label>
            <input
              type='text'
              id='adr'
              value={s_adr}
              onChange={(e) => set_adr(e.target.value)}
            />
            <label htmlFor='cgpa'>CGPA:</label>
            <input
              type='text'
              id='cgpa'
              value={s_cgpa}
              onChange={(e) => set_cgpa(e.target.value)}
            />
            <button id="Add_button" onClick={handleAdd}>Add</button>
            <button id="cancel2" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      }{showEdit &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Edit Student Details</h2>
            <label htmlFor='reg'>Reg_No:</label>
            <input
              type='text'
              id='reg'
              value={s_reg_no}
              onChange={(e) => set_reg_no(e.target.value)}
            />
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={s_name}
              onChange={(e) => set_name(e.target.value)}
            />
            <label htmlFor='age'>Age:</label>
            <input
              type='number'
              id='age'
              value={s_age}
              onChange={(e) => set_age(e.target.value)}
            />
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={s_email}
              onChange={(e) => set_email(e.target.value)}
            />
            <label htmlFor='adr'>Address:</label>
            <input
              type='text'
              id='adr'
              value={s_adr}
              onChange={(e) => set_adr(e.target.value)}
            />
            <label htmlFor='cgpa'>CGPA:</label>
            <input
              type='text'
              id='cgpa'
              value={s_cgpa}
              onChange={(e) => set_cgpa(e.target.value)}
            />
            <button onClick={handleUpdate}>Update</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      }
    </div>
  );
};

export default Students;
