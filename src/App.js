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
  FILTER_SET_PROJECT:"setproject",
  ADD_TODO : "addtodo",
  TRASH_TODO:"trashtodo",
  CHEAK_TODO:"cheaktodo",

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
      return Projects.map(project=>{if(project.id===action.payload.project){return {...project,Todos:project.Todos.map(todo=>{if(todo.id===action.payload.id){return{...todo,ischeaked:!project.ischeaked}}return todo})}}else{return project}})

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

// to heandle Filterlist state =------------------------
const filteredlistreduser=(Filteredlist,action)=>{
  switch (action.type) {
    case ACTION.FILTER_COMPLETED:
      return action.payload.list.filter(item=>item.ischeaked).sort((a,b)=>a.filterindex-b.filterindex)
    case ACTION.FILTER_UNCOMPLETED:
      return action.payload.list.filter(item=>!item.ischeaked).sort((a,b)=>a.filterindex-b.filterindex)
    case ACTION.FILTER_SET_PROJECT:
      return action.payload.list
  
    default:
      return action.payload.list
  }
}


//react App function =------------------------------------

function App() {

const [Inputtext,setInputtext]=useState("")
const [Filter,setFitler]=useState("all")
const [Todos,setTodos]=useState([])
const [Filteredtodo,setFilteredtodo]=useState([])
const [Weather,setWeather]=useState([])
const [isdark,setisdark]=useState(false)
const [quote,setquote]=useState({})
const [isProjectTabToggle,setisProjectTabToggle]=useState(false)
const [SelectedProject,setSelectedProject]=useState(11111)
const [Openprojectlable,setOpenprojectlable]=useState({})

const [Projects,dispatchProjects] = useReducer(projectreduser,[PRESETS.PROJECTS_MYTODOS])
const [Filteredlist,dispatchFilteredlist]=useReducer(filteredlistreduser,[])


  const savetolocal=()=>{
    localStorage.setItem("todos",JSON.stringify(Todos))
  }
  const savetolocaldark=()=>{
    localStorage.setItem("dark",JSON.stringify(!isdark))
  }
  const savetolocaldate=()=>{
    let date=Date()
    date=date.split(" ",3)
    date=`${date[0]} ${date[1]} ${date[2]}`
    localStorage.setItem("date",JSON.stringify({date,quote}))
  }

  

  const getfromlocal=()=>{
    function quotes(){
      fetch('https://node-server-proxy-1.herokuapp.com/quote')
          .then(res=>res.json())
          .then(data=>{setquote(data)})
    }
    if(localStorage.getItem("todos")!==null){
      setTodos( JSON.parse(localStorage.getItem("todos")))
      setFilteredtodo(JSON.parse(localStorage.getItem("todos")))
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

  const updatelist=(list,sindex,dindex)=>{
  const temp = list.splice(sindex,1)
  list.splice(dindex,0,temp[0])
  return list
  }

  const updatefilterindex=(list,flist,sindex,dindex)=>{
    const temp = flist.splice(sindex,1)
    flist.splice(dindex,0,temp[0])
    list.map(todo=>todo.filterindex=flist.indexOf(todo))
    return list
    }


 const ondragend=(result)=>{
  if(result.destination===null)
  return
  else if(result.source.index===result.destination.index)
  return
  else{
    switch(Filter){
      case "all":setTodos([...updatelist(Todos,result.source.index,result.destination.index)])
        break
      default:setTodos([...updatefilterindex(Todos,Filteredtodo,result.source.index,result.destination.index)]) 
        break
    }
  
}
  }

  const enabledark = () =>{
    setisdark(!isdark)
    savetolocaldark()
  }

  const openproject=(id)=>{
      setSelectedProject(id)
      let temp = Projects.filter(project=>project.id===SelectedProject)
      temp = {...temp[0]}
      dispatchFilteredlist({type:ACTION.FILTER_SET_PROJECT,payload:{list:temp.Todos}})
      setOpenprojectlable({lable:temp.lable,id:SelectedProject})
      setisProjectTabToggle(false)

  }



  useEffect(()=>{
    const interval=setInterval(weatherapiproxy,1000*60*60)
    return ()=>clearInterval(interval)
    },[])


  // useEffect(getfromlocal,[])
  // useEffect(savetolocal,[Todos])
  // useEffect(dofilter,[Filter,Todos])
  // useEffect(weatherapiproxy,[])
  // useEffect(savetolocaldate,[quote])
  useEffect(()=>isProjectTabToggle?dispatchFilteredlist({type:Filter,payload:{list:Projects}}):openproject(SelectedProject),[isProjectTabToggle])
  useEffect(()=>isProjectTabToggle?dispatchFilteredlist({type:Filter,payload:{list:Projects}}):openproject(SelectedProject),[Filter,Projects]) 


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
        setTodos={setTodos}
        Todos={Todos}
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
          > {console.log({Filteredlist})}
            {Filteredlist.map((item,i)=>
                <ProjectTab
                key={item.id}
                project={item}
                dispatchProjects = {dispatchProjects}
                index={i}
                openproject={openproject}
                isProjectTabToggle={isProjectTabToggle}
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
