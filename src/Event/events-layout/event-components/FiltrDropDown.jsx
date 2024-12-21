import React,{useState,useRef} from "react";
import './FiltrDropDown.css' 
import {useClickOutside} from '../../../useClickOutside';
function FiltrDropDown({filtr_list,isOpen,change,setIsOpen}){
    const menuRef = useRef(null);

    useClickOutside(menuRef,()=>{
        if(isOpen)setTimeout(()=>{
                setIsOpen(false);
            }
        ,80);
    });
    const handleChanges = (event) =>{
        change(event.target.value);
    }
    return( 
        <nav className={`filtr_menu ${isOpen ? "active" : ""}`} ref={menuRef}>
            <div className="filtr_list">
                {
                    filtr_list.map((filtr)=>{
                        return(
                            <div className="filtr_item"><input style={{margin: "0px 5px 0px 0px"}} type="checkBox" value={filtr.name} key={filtr.id} onChange={handleChanges}/><label>{filtr.name}</label></div>
                        )
                    })
                }
            </div>
        </nav>
    )
}
export default FiltrDropDown;