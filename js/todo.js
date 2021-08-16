class Todo{
    constructor(root_all,root_activ,root_pending){
        this.root_all=root_all                                                                  //tab for display all items
        this.root_activ=root_activ                                                              //tab for display activ items
        this.root_pending=root_pending                                                          //tab for display all items
        this.date=new Date()                                                                    //date
        this.items_list=[]                                                                      //list of all items data
        
    }


    load_items(){                                                                              //load items from local storage
        const items=JSON.parse(localStorage.getItem("todo"))
        for(let item of items){
            let day=new Date(item.date).toLocaleString("default",{day:"numeric"})               
            let month=new Date(item.date).toLocaleString("default",{month:"short"})
            let complate=(item.status=="activ")?false:true                                     //check status of item
            let root_elm=(item.status=="activ")?this.root_activ:this.root_pending              //depending on the status of the item, the appropriate tab is selected
            this.render_item(item.content,item.id,day,month,complate)                          // for render loaded items

            let item_data={                                                                    //create JSON item data and push in list of all items
                'id':item.id,
                'status':item.status,
                'root_el':[this.root_all,root_elm],
                "date":new Date(item.date),
                "content":item.content,
                toJSON(){
                    return{
                        'id':this.id,
                        'status':this.status,
                        "date":this.date,
                        "content":this.content,
                    }
                }
            }

            this.items_list.push(item_data)                                                     //push in list of all items

            if(complate){                                                                       //marked completed items                                       
                document.getElementsByClassName(item.id)[0].classList.toggle("completed")
                document.getElementsByClassName(item.id)[1].classList.toggle("completed")
            }
        }
    }

    render_item(content,id,day,month,complete=false){                                           //for render items
        
        const template=`                                                                        
        <div class="todo_item ${id}" data_id="${id}">
            <div class="todo_item_date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="todo_item_content">
                <span class="data">${content}</span>
            </div>
            <span class="delete_btn" del_id="${id}"></span>
        </div>
        
        `
        this.root_all.innerHTML+=template                                                       // all items(activ and pending) displayed in all items tab

        if(complete==false){                                                                    //depending on the status of the item, displayed in a specific tab
            this.root_activ.innerHTML+=template
        }else{ 
            this.root_pending.innerHTML+=template
        
        }
    }
    
    add_item(content){                                                                          //for add new items
        const id=Math.random().toString(36).substring(7)
        const day=this.date.toLocaleString("default",{day:"numeric"})
        const month=this.date.toLocaleString("default",{month:"short"})

        this.render_item(content,id,day,month)                                                  //for render items

        const item={                                                                            //create new JSON item data and push in list of all items
            'id':id,
            'status':"activ",
            'root_el':[this.root_all,this.root_activ],
            "date":this.date,
            "content":content,
            toJSON(){
                return{
                    'id':this.id,
                    'status':this.status,
                    "date":this.date,
                    "content":this.content,
                }
            }
        }

        this.items_list.push(item)                                                              //push new item in list of all items
        this.save_to_storage()                                                                  //save-update data to local storage
    }

    delete_item(del_id){                                                                        //delete item
        const del_items=document.getElementsByClassName(del_id)                                 
        del_items[0].remove()                                                                   //remove item, remove item from all items tab
        del_items[0].remove()                                                                   //remove item, remove item from activ items tab or pending items tab
        for(let i=0;i<this.items_list.length;i++){
            if(del_id==this.items_list[i].id){                                                  //delete item form list of all items
                this.items_list.splice(i,1)
                break                                                                          
            }
        }
        this.save_to_storage()                                                                   //save-update data to local storage  
    }

    edit_status(data_id){                                                                       //for edit status of item, marked item and move to specific tab
        for(let item of this.items_list){                                                       
            if(item.id==data_id){                                                               //search for item in list of all items
                let root_el=item.root_el[1]                                                     //get specific tab(activ or pending)
                let item_el=document.getElementsByClassName(data_id)[1]                         //get item from specific tab

                root_el.removeChild(item_el)                                                    //remove item from specific tab, and later move to another new spec. tab

                if(item.status=="activ"){                                                       //chek status of item and move to new spec. tab
                    this.root_pending.appendChild(item_el)
                    item.status="pending"                                                       //updata new status of item
                    item.root_el[1]=this.root_pending                                           //updata new spec. tab
                    this.save_to_storage()                                                      //save-update data to local storage  
                    break
                }else if(item.status=="pending"){                                               //same like before
                    this.root_activ.appendChild(item_el)
                    item.status="activ"
                    item.root_el[1]=this.root_activ
                    this.save_to_storage() 
                    break
                }
                break

            }
        }
    }

    save_to_storage(){                                                                          //for save to local storage
        localStorage.setItem("todo",JSON.stringify(this.items_list))
    }
      
}