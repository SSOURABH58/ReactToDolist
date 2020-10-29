import React from 'react'

function Inputtabe({Inputtext,setInputtext,setTodos,Todos,setFitler,Filter}){

    function getinput(inputevent){
        setInputtext(inputevent.target.value)
    }

    function settask (clickevent){
        clickevent.preventDefault()
        const date=new Date()
        const dupeid=Todos.filter(todo=>todo.lable===Inputtext).length
        const todo = {id:date.getTime(),lable:Inputtext,ischeaked:false,istrashed:false,dupeid:dupeid,filterindex:Todos.length}
        setTodos([...Todos,todo])
        setInputtext("")
    }

    const setfilter=(filterevent)=>{
        setFitler(filterevent.target.value)
    }

    const trashall=()=>{
        switch (Filter) {
            case "completed":
                setTodos(Todos.filter(todo=>!todo.ischeaked))
                break;
            case "uncompleted":
                setTodos(Todos.filter(todo=>todo.ischeaked))
                break;
        
            default:
                setTodos([])
                break;
        }
    }
    

    return(
        <div className="inputtabe">
            <form action="#">
                <input onChange={getinput} value={Inputtext} type="text" className="inputbox"/>
                <button onClick={settask} className="addtask" type="submit"><i className="fa fa-plus-square"></i></button>
            </form>
            <div className="filtercont">
            <select onChange={setfilter} name="filter" className="filter">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
            </select>
            <button className="trashall filter" onClick={trashall}><i className="fa fa-trash"></i></button>
            </div>
            
        </div>
    );
}

export default Inputtabe