import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

import {ACTION} from '../App'

// reacr function =-------------------------------------
function ProjectTab({project,dispatchProjects,index,openproject,isProjectTabToggle}){

  //functions =--------------------------------------------------
    const trashproject=()=>{
      isProjectTabToggle?
      dispatchProjects({type:ACTION.TRASH_PROJECT,payload:{id:project.id}})
      :
      dispatchProjects({type:ACTION.TRASH_TODO,payload:{id:project.id,project:project.projectid}})
    }

    const cheakproject=()=>{
      isProjectTabToggle?
      dispatchProjects({type:ACTION.CHEAK_PROJECT,payload:{id:project.id}})
      :
      dispatchProjects({type:ACTION.CHEAK_TODO,payload:{id:project.id,project:project.projectid}})
    }

    const selectproject=()=>{
      openproject(project.id)
    }

    return(
  // TO make this dive Dragble =--------------------------------------------
        <Draggable draggableId={String(project.id)} index={index} >
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

// actule contaner =----------------------------------------------------
        id={project.id} className={`taskcont ${project.istrashed?"deleted":""} ${project.ischeaked?"cheaked":""}`}>
            <div className="draghand" {...provided.dragHandleProps} ><i className="fa fa-hand-rock-o draghand"></i></div>
            <li className="tasklable cleckable" onClick={isProjectTabToggle?selectproject:""}>
                {project.lable}
            <p className={project.dupeid&&!project.istrashed?"circlenum":"dnone"}>{project.dupeid}</p>
            </li>
            <button onClick={cheakproject} className={`taskcheak ${project.istrashed?"deleted":""}`}><i className={ !project.istrashed? project.ischeaked?"fa fa-remove":"fa fa-check-square":""}></i></button>
            <button onClick={trashproject} className={`tasktrash ${project.istrashed?"deleted":""}`}><i className={ !project.istrashed? "fa fa-trash":""}></i></button>
        </div>
        )}}
        </Draggable>
    
    );
}


export default ProjectTab