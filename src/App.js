import React,{useState,useEffect} from 'react'
import './App.css';
import { DragDropContext,Droppable } from 'react-beautiful-dnd';

//components 
import Inputtabe from './components/inputtabe'
import Tasks from './components/tasks'
import Top from './components/top'

function App() {
const [Inputtext,setInputtext]=useState("")
const [Filter,setFitler]=useState("all")
const [Todos,setTodos]=useState([])
const [Filteredtodo,setFilteredtodo]=useState([])
const [Weather,setWeather]=useState([])
const [isdark,setisdark]=useState(false)
const [isdbg,setisdbg]=useState(false)

const dofilter=()=>
  {
    const arangefilter=(list)=>{
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length-1; j++) {
          if(list[j].filterindex>list[j+1].filterindex)
            {
            let temp=list[j]
            list[j]=list[j+1]
            list[j+1]=temp
            }
          
        }
      }
      return list
    }
    switch (Filter) {
      case "completed":setFilteredtodo(arangefilter(Todos.filter(todo=>todo.ischeaked===true)))
        break;
      case "uncompleted":setFilteredtodo(arangefilter(Todos.filter(todo=>todo.ischeaked===false)))
        break;
    
      default:setFilteredtodo(Todos)
        break;
    }
  }

  const savetolocal=()=>{
    localStorage.setItem("todos",JSON.stringify(Todos))
  }
  const getfromlocal=()=>{
    if(localStorage.getItem("todos")!==null){
      setTodos( JSON.parse(localStorage.getItem("todos")))
      setFilteredtodo(JSON.parse(localStorage.getItem("todos")))
    }
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
    // if(!isdark)
    // setisdbg(true)
    // else
    // setisdbg(false)
  }
  


  useEffect(getfromlocal,[])
  useEffect(savetolocal,[Todos])
  useEffect(dofilter,[Filter,Todos])
  useEffect(weatherapiproxy,[])

  return (
    <div className={`App ${isdark?"bodyDark":""}`}>

      <Top
      Weather = {Weather}
      />

      <header>
        <button className="darkmodebtn" onClick={enabledark}><i className="fa fa-adjust"></i></button>
        <h1>To Do List</h1>
        <p className="weather">{Weather.icon==="-"?"Allow location or check internet":`${Weather.icon} ${Weather.title} at ${Weather.temp}℃ in ${Weather.city}`}</p>
      </header>

      <Inputtabe
        Inputtext ={Inputtext}
        setInputtext={setInputtext}
        setTodos={setTodos}
        Todos={Todos}
        setFitler={setFitler}
        Filter={Filter}
      />
      <DragDropContext onDragEnd={ondragend}>
        <Droppable droppableId="1">
          {(provided)=>(
          <ul 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="tasks"
          >
            {Filteredtodo.map((todo,i)=>
              
                <Tasks 
                key={todo.id}
                index={i}
                setTodos={setTodos}
                Todos={Todos}
                lable={todo.lable}
                id={todo.id}  
                ischeaked={todo.ischeaked}
                istrashed={todo.istrashed}
                dupeid={todo.dupeid}
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
