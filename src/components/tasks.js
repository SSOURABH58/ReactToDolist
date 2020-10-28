import React from 'react'
import { Draggable } from 'react-beautiful-dnd';


function Tasks({setTodos,lable,id,ischeaked,Todos,istrashed,dupeid,index}){
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
        <Draggable draggableId={String(id)} index={index} key={id}>
        {(provided)=>{
      if (
		typeof (
          provided.draggableProps.onTransitionEnd
        ) === 'function'
      ) {
        window?.requestAnimationFrame(() =>
          provided.draggableProps.onTransitionEnd({
            propertyName: 'transform',
          })
        );
      }
      return(
        <div 
        ref={provided.innerRef}
        {...provided.draggableProps}
       
        
        id={id} onTransitionEnd={transend} className={`taskcont ${istrashed?"deleted":""} ${ischeaked?"cheaked":""}`}>
            <div className="draghand" {...provided.dragHandleProps} ><i className="fa fa-hand-rock-o draghand"></i></div>
            <li className="tasklable">
                {lable}
            <p className={dupeid&&!istrashed?"circlenum":"dnone"}>{dupeid}</p>
            {/*displaynone  */}
            </li>
            <button onClick={cheaktask} className={`taskcheak ${istrashed?"deleted":""}`}><i className={ !istrashed? ischeaked?"fa fa-remove":"fa fa-check-square":""}></i></button>
            <button onClick={trashtask} className={`tasktrash ${istrashed?"deleted":""}`}><i className={ !istrashed? "fa fa-trash":""}></i></button>
        </div>
        )}}
        </Draggable>
    
    );
}


export default Tasks