import React,{useState,useEffect} from 'react'

function Top({Weather}){
    const [Time,setTime]=useState([])
    const getdate=()=>{
        let data=Date()
        data = data.split(" ",5)
        let time= data[4].split(":",2)
        if(time[0]>12){
            time[0]-=12
            time.push("pm")
        }else if(time[0]===0){
            time[0]=12
            time.push("am")
        }else if(time[0]===12){
            time[0]=12
            time.push("pm")
        }else{
            time.push("am")
        }
        setTime({hour:time[0],min:time[1],maridin:time[2],day:data[0],date:data[2],mounth:data[1],year:data[3]})
        
    }    

    useEffect(()=>{
        const interval=setInterval(getdate,1000)
        return ()=>clearInterval(interval)
        },[])
    

    return(
        <div className="top">
    <div className="timetab">
        <h1>{`${Time.hour}:${Time.min}${Time.maridin}`}</h1>
        <p>{`${Time.day} , ${Time.date} ${Time.mounth} ${Time.year}`}</p>
    </div>
    <div className="weatherd">
        <h1>{`${Weather.icon} ${Weather.temp}°c`}</h1>
        <p>{Weather.icon==="-"?"Allow location or check internet":`${Weather.title} in ${Weather.city}`}</p>
    </div>
    </div>
    );
}

export default Top