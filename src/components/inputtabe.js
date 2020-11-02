import React from 'react'

import {ACTION} from '../App'


function Inputtabe({Inputtext,setInputtext,setFitler,Filter,isProjectTabToggle,setisProjectTabToggle,dispatchProjects,Openprojectlable}){


    function getinput(inputevent){
        setInputtext(inputevent.target.value)
    }

    const addprojects=(e)=>{
        e.preventDefault();
        isProjectTabToggle?
        dispatchProjects({type:ACTION.ADD_PROJECT,payload:{lable:Inputtext}})
        :dispatchProjects({type:ACTION.ADD_TODO,payload:{lable:Inputtext,id:Openprojectlable.id}})
        setInputtext("")
    }

    const openprojects=e=>{
        e.preventDefault()
        setisProjectTabToggle(!isProjectTabToggle)
    }

    const setfilter=(filterevent)=>{
        setFitler(filterevent.target.value);
    }

    // const trashall=()=>{
    //     switch (Filter) {
    //         case "completed":
    //             setTodos(Todos.filter(todo=>!todo.ischeaked))
    //             break;
    //         case "uncompleted":
    //             setTodos(Todos.filter(todo=>todo.ischeaked))
    //             break;
        
    //         default:
    //             setTodos([])
    //             break;
    //     }
    // }
    

    return(
        <div className="inputtabe">
            <form action="#">
                <input onChange={getinput} value={Inputtext} type="text" className="inputbox" placeholder={isProjectTabToggle?"Add a New Peoject ..":`Add to ${Openprojectlable.lable}`}/>
                <button onClick={openprojects} className="addtask openproject" ><i className="fa fa-angle-down"></i></button>
                <button onClick={addprojects} className="addtask" type="submit"><i className="fa fa-plus-square"></i></button>
            </form>
            <div className="filtercont">
            <select onChange={setfilter} name="filter" className="filter">
                <option value={ACTION.FILTER_ALL}>All</option>
                <option value={ACTION.FILTER_COMPLETED}>Completed</option>
                <option value={ACTION.FILTER_UNCOMPLETED}>Uncompleted</option>
            </select>
            <button className="trashall filter" ><i className="fa fa-trash"></i></button>
            </div>
        </div>
    );
}

export default Inputtabe