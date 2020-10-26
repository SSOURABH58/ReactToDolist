import React,{useState,useEffect} from 'react'
import './App.css';

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

const dofilter=()=>
  {
    switch (Filter) {
      case "completed":setFilteredtodo(Todos.filter(todo=>todo.ischeaked===true))
        break;
      case "uncompleted":setFilteredtodo(Todos.filter(todo=>todo.ischeaked===false))
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

  useEffect(getfromlocal,[])
  useEffect(savetolocal,[Todos])
  useEffect(dofilter,[Filter,Todos])
  useEffect(weatherapiproxy,[])

  return (
    <div className="App">

      <Top
      Weather = {Weather}
      />

      <header>
        <h1>To Do List</h1>
        <p className="weather">{Weather.icon==="-"?"Allow location or check internet":`${Weather.icon} ${Weather.title} at ${Weather.temp}℃ in ${Weather.city}`}</p>
      </header>

      <Inputtabe
        Inputtext ={Inputtext}
        setInputtext={setInputtext}
        setTodos={setTodos}
        Todos={Todos}
        setFitler={setFitler}
      />
      <ul className="tasks">
        {Filteredtodo.map(todo=>
          <Tasks 
          setTodos={setTodos}
          Todos={Todos}
          lable={todo.lable}
          id={todo.id}  
          ischeaked={todo.ischeaked}
          istrashed={todo.istrashed}
          dupeid={todo.dupeid}
          key={todo.id}
          />
        )  
        }
      </ul>

      <footer>
        <p>© Sourabh Soni 2020</p>
      </footer>
    </div>
  );
}

export default App;
