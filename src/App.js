import React,{useState,useEffect, useReducer} from 'react'
import './App.css';
import { DragDropContext,Droppable } from 'react-beautiful-dnd';

//components 
import Inputtabe from './components/inputtabe'
import Top from './components/top'
import ProjectTab from './components/projecttab'

// frequantly used strings =-------------------
export const ACTION = {
  ADD_PROJECT : "addproject",
  TRASH_PROJECT:"trashproject",
  CHEAK_PROJECT:"cheakproject",
  FILTER_ALL:"all",
  FILTER_COMPLETED:"completed",
  FILTER_UNCOMPLETED:"uncompleted",
  ADD_TODO : "addtodo",
  TRASH_TODO:"trashtodo",
  CHEAK_TODO:"cheaktodo",
  ON_PROJECT_DRAGE:"onprojectdrage",
  ON_TODO_DRAGE:"ontododrage",
  TRASH_ALL_PROJECTS:"trashallprojects",
  TRASH_ALL_TODOS:"trashalltodos",
  PROJECTS:"projects",
  DATE:"date",
  DARK:"dark",
  GETPROJECTS:"getprojects",
  RECOVERTODOS:"recovrtodos"
}

const PRESETS = {
  PROJECTS_MYTODOS : {id:11111,lable:"My ToDo's",ischeaked:false,istrashed:false,dupeid:0,filterindex:0,Todos:[]}
}

// functions =-----------------------------------

// to hendal Projects state =------------------------------
function projectreduser(Projects,action){
  switch (action.type) {
    case ACTION.ADD_PROJECT:
      return [...Projects,newProject(action.payload.lable,Projects)];
    case ACTION.TRASH_PROJECT:
      return Projects.filter(project=>project.id!==action.payload.id);
    case ACTION.CHEAK_PROJECT:
      return Projects.map(project=>{if(project.id===action.payload.id){return {...project,ischeaked:!project.ischeaked}}return project})

    case ACTION.ADD_TODO:
      return Projects.map(project=>{if(project.id===action.payload.id){return{...project,Todos:[...project.Todos,newTodo(action.payload.lable,action.payload.id,Projects)]}}else{return project}})
    case ACTION.TRASH_TODO:
      return Projects.map(project=>{if(project.id===action.payload.project){return {...project,Todos:project.Todos.filter(todo=>todo.id!==action.payload.id)}}else{return project}})
    case ACTION.CHEAK_TODO:
      return Projects.map(project=>{
        if(project.id===action.payload.project){
          return {...project,Todos:project.Todos.map(todo=>{
            if(todo.id===action.payload.id){
              return{...todo,ischeaked:!todo.ischeaked}}
            else {return todo}})}}
        else{return project}})
    
    case ACTION.ON_PROJECT_DRAGE:
      {switch(action.payload.filter){
        case ACTION.FILTER_ALL:
          return [...updatelistsequence(Projects,action.payload.sindex,action.payload.dindex)]
        default:
          return [...updatefilterindex(Projects,action.payload.filter,action.payload.sindex,action.payload.dindex)]
      }}
    case ACTION.ON_TODO_DRAGE:
      {let temp = Projects.filter(project=>project.id===action.payload.id)
      temp = {...temp[0]}
      switch(action.payload.filter){
        case ACTION.FILTER_ALL:
          return Projects.map(project=>project.id===action.payload.id?{...project,Todos:[...updatelistsequence(temp.Todos,action.payload.sindex,action.payload.dindex)]}:project) 
        default:
          return Projects.map(project=>project.id===action.payload.id?{...project,Todos:[...updatefilterindex(temp.Todos,action.payload.filter,action.payload.sindex,action.payload.dindex)]}:project)
      }}

    case ACTION.TRASH_ALL_PROJECTS:
      {switch (action.payload.filter) {
        case ACTION.FILTER_COMPLETED:
          return Projects.filter(item=>!item.ischeaked)
        case ACTION.FILTER_UNCOMPLETED:
          return Projects.filter(item=>item.ischeaked)
        default:
          return []
      }}
    case ACTION.TRASH_ALL_TODOS:
      {switch (action.payload.filter) {
        case ACTION.FILTER_COMPLETED:
          return Projects.map(project=>project.id===action.payload.id?{...project,Todos:project.Todos.filter(item=>!item.ischeaked)}:project) 
        case ACTION.FILTER_UNCOMPLETED:
          return Projects.map(project=>project.id===action.payload.id?{...project,Todos:project.Todos.filter(item=>item.ischeaked)}:project) 
        default:
          return Projects.map(project=>project.id===action.payload.id?{...project,Todos:[]}:project) 
      }}
    
      case ACTION.GETPROJECTS:
        return action.payload.projects

      case ACTION.RECOVERTODOS:
        return Projects.map(project=>project.id===PRESETS.PROJECTS_MYTODOS.id?{...project,Todos:action.payload.todos}:project)

    default:
      return Projects;
  }
}

const newProject=(lable,Projects)=>{
  const dupeid=Projects.filter(project=>project.lable===lable).length
  return {id:Date.now(),lable:lable,ischeaked:false,istrashed:false,dupeid:dupeid,filterindex:Projects.length,Todos:[]}
}
const newTodo=(lable,id,Projects)=>{
  let temp = Projects.filter(project=>project.id===id)
  temp = {...temp[0]}
  const Todos=temp.Todos
  const dupeid=Todos.filter(todo=>todo.lable===lable).length
  return {id:Date.now(),lable:lable,ischeaked:false,istrashed:false,dupeid:dupeid,filterindex:Projects.length,projectid:id}
}
const updatelistsequence=(list,sindex,dindex)=>{
  const temp = list.splice(sindex,1)
  list.splice(dindex,0,temp[0])
  return list
  }
const updatefilterindex=(list,filter,sindex,dindex)=>{
  let flist
  switch (filter) {
    case ACTION.FILTER_COMPLETED:
      flist=list.filter(item=>item.ischeaked)
      break;
    case ACTION.FILTER_UNCOMPLETED:
      flist=list.filter(item=>!item.ischeaked)
      break;
    default:flist=list
      break;
  }

  const temp = flist.splice(sindex,1)
  flist.splice(dindex,0,temp[0])
  list.map(todo=>todo.filterindex=flist.indexOf(todo))
  return list
  }  

// to heandle Filterlist state =------------------------
const filteredlistreduser=(Filteredlist,action)=>{
  switch (action.type) {
    case ACTION.FILTER_COMPLETED:
      return action.payload.list.filter(item=>item.ischeaked).sort((a,b)=>a.filterindex-b.filterindex)
    case ACTION.FILTER_UNCOMPLETED:
      return action.payload.list.filter(item=>!item.ischeaked).sort((a,b)=>a.filterindex-b.filterindex)
  
    default:
      return action.payload.list
  }
}

//react App function =------------------------------------

function App() {

const [Projects,dispatchProjects] = useReducer(projectreduser,[PRESETS.PROJECTS_MYTODOS])
const [Filteredlist,dispatchFilteredlist]=useReducer(filteredlistreduser,[])

const [SelectedProject,setSelectedProject]=useState(11111)
const [Inputtext,setInputtext]=useState("")
const [Filter,setFitler]=useState("all")
const [Weather,setWeather]=useState([])
const [isdark,setisdark]=useState(false)
const [quote,setquote]=useState({})
const [isProjectTabToggle,setisProjectTabToggle]=useState(false)
const [Openprojectlable,setOpenprojectlable]=useState(PRESETS.PROJECTS_MYTODOS)




  const savetolocal=()=>{
    localStorage.setItem(ACTION.PROJECTS,JSON.stringify(Projects))
  }
  const savetolocaldark=()=>{
    localStorage.setItem(ACTION.DARK,JSON.stringify(!isdark))
  }
  const savetolocaldate=()=>{
    let date=Date()
    date=date.split(" ",3)
    date=`${date[0]} ${date[1]} ${date[2]}`
    localStorage.setItem(ACTION.DATE,JSON.stringify({date,quote}))
  }

  

  const getfromlocal=()=>{
    function quotes(){
      fetch('https://node-server-proxy-1.herokuapp.com/quote')
          .then(res=>res.json())
          .then(data=>{setquote(data)})
    }
    if(localStorage.getItem(ACTION.PROJECTS)!==null){
      dispatchProjects({type:ACTION.GETPROJECTS,payload:{projects:JSON.parse(localStorage.getItem(ACTION.PROJECTS))}})
    }
    if(localStorage.getItem("todos")!==null){
      dispatchProjects({type:ACTION.RECOVERTODOS,payload:{todos:JSON.parse(localStorage.getItem("todos"))}})
      localStorage.clear("todos")
    }
    if(localStorage.getItem("dark")!==null){
      setisdark(JSON.parse(localStorage.getItem("dark")))
    }
    if(localStorage.getItem("date")!==null){
      const prvdate=JSON.parse(localStorage.getItem("date"))
      let date=Date()
      date=date.split(" ",3)
      date=`${date[0]} ${date[1]} ${date[2]}` 
      if(prvdate.date!==date || prvdate.quote.q===undefined)
        {
        quotes()}
      else
        setquote(prvdate.quote)
    }else
       quotes()
  }

  function weatherapiproxy(){
    navigator.geolocation.getCurrentPosition(position=>{
        const lat =position.coords.latitude
        const lon = position.coords.longitude
        const coords = {lat,lon}

        const opc = {
            method : 'POST',
            headers : {
                'Content-Type':'application/json'
            },
            body : JSON.stringify(coords)
        }

        setWeather({icon:"-",title:"(Allow location)",temp:"-",city:"(or check internet)"})

        fetch('https://node-server-proxy-1.herokuapp.com/weather',opc)
            .then(res=>{return res.json()})
            .then(data=>{
                let icon = data.icon

                const date = new Date()
                const hours = date.getHours()

                let isnight = hours<6 || hours>18

                if(isnight){
                    switch(icon){
                        case "☀": icon="🌙" 
                        break
                        case "🌦" : icon="🌧" 
                        break
                        default:
                          break
                    }
                }
                setWeather({icon:icon,title:data.title,temp:data.temp,city:data.city})
            
            })
    })
  }

 const ondragend=(result)=>{
  if(result.destination===null)
  return
  else if(result.source.index===result.destination.index)
  return
  else{
    isProjectTabToggle?
    dispatchProjects({type:ACTION.ON_PROJECT_DRAGE,payload:{filter:Filter,sindex:result.source.index,dindex:result.destination.index}})
    :dispatchProjects({type:ACTION.ON_TODO_DRAGE,payload:{id:SelectedProject,filter:Filter,sindex:result.source.index,dindex:result.destination.index}})
    }
  }

  const enabledark = () =>{
    setisdark(!isdark)
    savetolocaldark()
  }




  useEffect(()=>{
    const interval=setInterval(weatherapiproxy,1000*60*60)
    return ()=>clearInterval(interval)
    },[])


  useEffect(getfromlocal,[])
  useEffect(savetolocal,[Projects])
  useEffect(weatherapiproxy,[])
  useEffect(savetolocaldate,[quote])
  useEffect(()=>{
    let temp = Projects.filter(project=>project.id===SelectedProject)
      temp = {...temp[0]}
    if(temp.Todos===undefined)
      { temp = Projects[0]
        if(Projects[0]===undefined){
          setisProjectTabToggle(true)
        }else
        {setOpenprojectlable({lable:temp.lable,id:temp.id})
        setSelectedProject(temp.id)}
      }
      if(isProjectTabToggle||temp===undefined)
        return dispatchFilteredlist({type:Filter,payload:{list:Projects}})
      else
        return dispatchFilteredlist({type:Filter,payload:{list:temp.Todos}})
  },[Projects,Filter,SelectedProject,isProjectTabToggle])



  return (
    <div className={`App ${isdark?"bodyDark":""}`}>

      <Top
      Weather = {Weather}
      />

      <header>
        <button className="darkmodebtn" onClick={enabledark}><i className="fa fa-adjust"></i></button>
        <h1>To Do List</h1>
         <blockquote className="quotes">&ldquo;{quote.q}&rdquo; <p> &mdash; {quote.a}</p></blockquote>
        <p className="weather">{Weather.icon==="-"?"Allow location or check internet":`${Weather.icon} ${Weather.title} at ${Weather.temp}℃ in ${Weather.city}`}</p>
      </header>

      <Inputtabe
        Inputtext ={Inputtext}
        setInputtext={setInputtext}
        setFitler={setFitler}
        Filter={Filter}
        setisProjectTabToggle={setisProjectTabToggle}
        isProjectTabToggle={isProjectTabToggle}
        dispatchProjects={dispatchProjects}
        Openprojectlable={Openprojectlable}
      />
      <DragDropContext onDragEnd={ondragend}>
        <Droppable droppableId="1">
          {(provided)=>(
          <ul 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="tasks"
          >
            {Filteredlist.map((item,i)=>
                <ProjectTab
                key={item.id}
                project={item}
                dispatchProjects = {dispatchProjects}
                index={i}
                isProjectTabToggle={isProjectTabToggle}
                setisProjectTabToggle={setisProjectTabToggle}
                setOpenprojectlable={setOpenprojectlable}
                setSelectedProject={setSelectedProject}
                />
            ) }
           {provided.placeholder}
          </ul>
          
           )}
           
        </Droppable>
      </DragDropContext>

      <footer>
        <p>© Sourabh Soni 2020</p>
      </footer>
    </div>
  );
}

export default App;
