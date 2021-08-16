window.addEventListener("load",function(){
    
    if(!localStorage.getItem("todo")){                                                  //for the first display if nothing is saved in the local storage
        const example_item=[{
            'id':"example",
            'status':"activ",
            "date":new Date(),
            "content":"Example business meeting",
        }]
        localStorage.setItem("todo",JSON.stringify(example_item))
    }
    
    const root_all=document.querySelector("#all_items_container")                       //tab for display all items
    const root_activ=document.querySelector("#active_items_container")                  //tab for display activ items
    const root_pending=document.querySelector("#completed_items_container")             //tab for display pending items
    const content=document.querySelector("#content")                                    //input fieled
    const header_btns=this.document.getElementsByClassName("header_cell")               //btns for select tabs
    const todo=new Todo(root_all,root_activ,root_pending)                               //app class
    
    todo.load_items()                                                                   // for loadedd items form local storage 
    

    for(let i=0;i<header_btns.length;i++){                                              //for select tabs
        header_btns[i].onclick=function(){
            open_tab(i+1);
        }
    }

    this.document.body.onclick=(e)=>{                                                   //global click listener
   
        if(e.target.id=="add_btn"){                                                     //click on add btn
            if(content.value!=""){
                todo.add_item(content.value)                                            //add item to data and display it
                content.value=""                                                        //clear input fieled
            }else{                                                                      // in case the input field is empty
                content.value="Please insert what you have to do"                       //alert msg
                content.classList.toggle("empty_input")                                 //alert red border 
                this.setTimeout(()=>{                                                   //clear alert msg and border
                    content.value=""
                    content.classList.toggle("empty_input")
                },1500)
            }
            
        }
        if(e.target.hasAttribute("del_id")){                                            //for delete items
           const del_id=e.target.getAttribute("del_id");
           todo.delete_item(del_id)   
        }
        if(e.target.hasAttribute("data_id")){                                           //for change status, on item click
            const data_id=e.target.getAttribute("data_id")
            todo.edit_status(data_id)
            document.getElementsByClassName(data_id)[0].classList.toggle("completed") 
            document.getElementsByClassName(data_id)[1].classList.toggle("completed")
          
        }
    }
    
})
window.addEventListener("hashchange",function(){                                        //for hash navigation
    examineHesh()
})






function examineHesh(){                                                                    //for hash navigation
    switch (window.location.hash){
        case "":
        case"#all-items":
            open_tab(1)
            break;
        case "#pending-items":
            open_tab(2)
            break;
        case "#active-items":
            open_tab(3)
            break;

    }
}

function open_tab(no){
    const all_itmes=this.document.getElementById("all_items")                               //first tab, with this tab, using the margins, the tabs are moved to the active tab
   
    document.querySelectorAll(".header_cell").forEach(item=>{
        item.classList.add("inactive_header_cell")                                          //add and remove a class to display a darker active icon
    })
    document.getElementById("tab"+no).classList.remove("inactive_header_cell")              //add and remove a class to display a darker active icon

    switch(no){                                                                             //tabs moved to the active tab
        case 1:
            all_itmes.style.marginLeft="0%"
            window.location.hash="#all-items"
            break;
        case 2:
            all_itmes.style.marginLeft="-100%"
            window.location.hash="#pending-items"
            break;
        case 3:
            all_itmes.style.marginLeft="-200%"
            window.location.hash="#active-items"
            break;

    }
}