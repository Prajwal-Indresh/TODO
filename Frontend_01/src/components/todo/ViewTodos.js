import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from "react-router-dom"; 

function Todos({isAuthenticated, setIsAuthenticated}) {
	const [todos, setTodos] = useState([]);
	const [changed, setChanged] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(20);

	const [filter, setFilter] = useState("All");
	let history = useHistory();



	useEffect(() => {
		if(!isAuthenticated){
			history.push("/");
		}
	}, [isAuthenticated, history])

	useEffect(() => {
		const loadData = async () => {
			let response = null;
			try {
				let url = `http://localhost:3002/api/todo/${pageNumber - 1}/${pageSize}`;

				if(filter === 'Completed'){
					url = `http://localhost:3002/api/todo/${pageNumber - 1}/${pageSize}?isCompleted=true`;
				} else if(filter === 'Not Completed'){
					url = `http://localhost:3002/api/todo/${pageNumber - 1}/${pageSize}?isCompleted=false`;
				}
				
				response = await axios.get(url, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`,}});
			} catch(error){
				if (error.response) {
					setErrorMessage(error.response.data.message);
				} else {
					setErrorMessage('Error: something happened');
				}
				return;
			}
			setErrorMessage('');
			setTodos(response.data);
	}
	

		loadData();
	}, [changed, filter])
	const filterControl = () => {
		return <right>
			<div className="category">
				
				<label >Show</label>
				<select value={filter} onChange={(e) => setFilter(e.target.value)}>
					<option value="All">All</option>
					<option value="Completed">Completed</option>
					<option value="Not Completed">NotCompleted</option>
				</select>
			</div>
		</right>
	}

	const markCompleted = async (id) => {
		
		try {
      await axios.put(`http://localhost:3002/api/todo/${id}/markcomplete`, {}, {
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`
				}
			});
    } catch(error){
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error: something happened');
      }
      return;
		}
		setErrorMessage('');
		setChanged(!changed);
		<li style={{textDecoration:"line-through"}}></li>
	}

	const deleteTodo = async (id) => {
		try {
      await axios.delete(`http://localhost:3002/api/todo/${id}`, {
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`
				}
			});
    } catch(error){
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error: something happened');
      }
      return;
		}
		setErrorMessage('');
		setChanged(!changed);
	}

	const showErrorMessage = () => {
    if(errorMessage === ''){
      return <div></div>
    }

    return <div className="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  }

	return (
		<div className="container">
			<h1 className="text-center">Todo List</h1>
			{showErrorMessage()}
			
			 {filterControl() }
      <table className="table">
        <thead>
          <tr>
			<th>Mark Done</th>
            <th>Task</th>
            <th>Target Date</th>
			<th>Update</th>
			<th>Delete</th>
         
          </tr>
        </thead>
        <tbody>
        {
          todos.map((todo) => {

            return <tr className={todo.isCompleted? 'completed' : ''} key={todo.id}>
			  <td><button className="btnM " onClick={() => markCompleted(todo.id)}></button></td>
			  
				<td style={todo.isCompleted?{textDecorationLine:'line-through'}:null || 
					moment().isAfter(moment(todo.targetDate)) ? {color:'red'} :null
				}>
				{todo.title}
			   </td>

              <td>{moment(todo.targetDate).format('ll')}</td>  
			         
				<td><Link to={{pathname: `/update/${todo.id}`}}><button className="btn">Edit📝</button></Link></td>
				<td><button className ="btnX btnX-danger" onClick={() => deleteTodo(todo.id)}>❌</button></td>

														
            </tr>
          })
        }
		
		{/* <button onclick="topFunction()" id="topBtn" title="Go to top">Go to Top</button> */}
		
		
        </tbody>
      </table>
    </div>
	);
}

// function isOverdue(item) {
// 	return !item.complete && item.timestampDue < new Date().getTime();
  
//   const itemClass = `list-group-item list-group-item-${isOverdue(item) ? "danger" : "info"}`;
// return (
// <li className={itemClass}>
// ...
// </li>);

// }



// function Item({ item, completeItem }) {
// 	const itemClass = `list-group-item list-group-item-${isOverdue(item) ? "danger" : "info"}`;
// 	return (
// 	  <li className={itemClass}>
// 		<div className="item">
// 		  <span className={`item-title${item.complete ? " complete-item" : ""}`}>
// 			{`${item.name} - ${dateformat(new Date(item.timestampDue), "dd-mmm-yyyy")}`}
// 		  </span>
// 		  {!item.complete && (
// 			<button type="button" className="btn btn-link" onClick={completeItem}>
// 			  Complete item
// 			</button>)}
// 		</div>
// 	  </li>);
//   }

export default Todos;