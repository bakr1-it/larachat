import { createContext, useContext, useRef } from "react";

export const EventBusContext = createContext();
export const EventBusProvider= ({children})=>{
    const events= useRef({});
    const emit= (name,data)=>{
        if(events.current[name]){
            for(let cb of events.current[name]){
                cb(data);

            }
        }

    }
    const on= (name,cb)=>{
        if(!events.current[name])events.current[name]= [];
        events.current[name].push(cb);

        return ()=> events.current[name] = events.current[name].filter((callback)=> callback!== cb);
    }
return (
    <EventBusContext.Provider value={{emit , on}}>
        {children}
    </EventBusContext.Provider>
)

}
export const useEvent= ()=>{
    return useContext(EventBusContext);
}
