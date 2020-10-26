import React from 'react'

function Tasks({setTodos,lable,id,ischeaked,Todos,istrashed,dupeid}){
    const trashtask=()=>{
        setTodos(Todos.map(todo=>{
            todo.id===id?todo.istrashed=true:todo.istrashed=false
            return todo
        }))
    }
    const transend=()=>{
        if(istrashed)
        setTodos(Todos.filter(todo=>todo.id!==id))
    }

    const cheaktask=()=>{
        setTodos(Todos.map(todo=>{
            if(todo.id===id)
                todo.ischeaked=!todo.ischeaked
            return todo
        }))
    }

    return(
        
        <div id={id} onTransitionEnd={transend} className={`taskcont ${istrashed?"deleted":""} ${ischeaked?"cheaked":""}`}>
            <li className="tasklable">
                {lable}
                <p className={dupeid?"circlenum":"displaynone"}>{dupeid}</p>
            </li>
            <button onClick={cheaktask} className={`taskcheak ${istrashed?"deleted":""}`}><i className={ischeaked?"fa fa-remove":"fa fa-check-square"}></i></button>
            <button onClick={trashtask} className={`tasktrash ${istrashed?"deleted":""}`}><i className="fa fa-trash"></i></button>
        </div>
    
    );
}

// taskcheak

export default Tasks