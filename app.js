//storage Controller


//Item Controller - IIFE

const ItemCtrl = (function(){
//ALL PRIVATE BELOW HERE!!!

//Item Constructor
const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
}

//data structure | the State
const data = {
    items: [
        // {id:0, name: 'Steak Dinner', calories: 1200 },
        // {id:1, name: 'Cookie', calories: 400 },
        // {id:2, name: 'Eggs', calories: 300 },
    ],
    currentItem : null,
    totalalories : 0


}

//ALL PUBLIC BELOW HERE
return{

    //public methods
    getItems: function(){
       return data.items;
    },
    addItem: function(name, calories){
        let ID;
       //Generate ID's AutoIncrement
       if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
       }else{
        ID = 0;
       }

       //parse Calories to Number
      calories = parseInt(calories);

      //Create new Item
      newItem = new Item(ID,name,calories);

      //Add to Items Array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
            let found = null; //empty item
            //loop through and match the id
            data.items.forEach((item) => {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
    },

    updateItem: function(name, calories){
        calories = parseInt(calories);  //turn the calories to a number
        let found = null; //empty item
        data.items.forEach((item) => {
            if(item.id === data.currentItem.id){ //edit button
               //set name and calories to what's passed in as args
               item.name = name;
               item.calories = calories;
               found = item;
            }
        });
        console.log(found);
        return found;
    },

    deleteItem: function(id){
        //get the id's with the MAP method
        ids = data.items.map((item)=>{
                return item.id;
        });
        //get the index
        const index = ids.indexOf(id);

        //splice it out of the array (remove)
        data.items.splice(index,1);
    },

    clearAllItems: function(){
        data.items = [];
    },
    //setter for current Item
    setCurrentItem: function(item){
        data.currentItem = item;
    },
    //Getter for current Item
    getCurrentItem: function (){
        return data.currentItem;
    },
    getTotalCalories: function (){
        let total = 0;
       data.items.forEach((item) => {
           total += item.calories;
       });

       //set total calories
       data.totalCalories = total;
       
       return data.totalCalories;
   },

    logData: function(){
        return data;
    }

}
})();

//End of Item Ctrl








//UIController
const UICtrl = (function(){

    //private
   const UISelectors = {
       itemList:'#item-list',
       listItems: '#item-list li',
       addBtn : '.add-btn',
       updateBtn : '.update-btn',
       deleteBtn : '.delete-btn',
       backBtn :'.back-btn',
       clearBtn : '.clear-btn',
       itemNameInput : '#item-name',
       itemCaloriesInput : '#item-calories',
       totalCalories: '.total-calories'
   }

    //public methods
    return{
        populateItemList: function(items){
            let html = '';
            //loop thru items , make each a li and insert it into dom
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:  </strong><em>${item.calories} Calories</em>
                <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
                
            });
            //Insert li 
            document.querySelector(UISelectors.itemList).innerHTML = html;


        },
        getItemInput: function (){
           return {
               name: document.querySelector(UISelectors.itemNameInput).value,
               calories: document.querySelector(UISelectors.itemCaloriesInput).value
           }     
        },
        //Add List Item
        addListItem: function(item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //create list Item Element
            const li = document.createElement('li');
            //add a class
            li.className = 'collection-item';
            //add an id
            li.id = `item-${item.id}`; //add item id dynamically

            //add the html
            li.innerHTML = `<strong>${item.name}:  </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            
            //insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },

        updateListItem: function(item){
            //Get listItem from the DOM
            let listItems = document.querySelectorAll(UISelectors.listItems); //grab all list items
            //Turn nodelist into an array
            listItems = Array.from(listItems);
            //We need to loop through a node list but first convert it to an array
            listItems.forEach((listItem) => {
                //get the ID
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    //update it
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:  </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
                }
            });
        },

        deleteListItem: function(id){
                const itemID = `#item-${id}`;
                const item = document.querySelector(itemID);
                item.remove();
        },
        //Clear input fields
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn nodelist into it into an array
            listItems = Array.from(listItems);
            listItems.forEach((item)=>{
                    item.remove();
                    console.log('remove in loop');
            })

        },
        hideList : function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function (){
            UICtrl.clearInput();  //make sure input is cleared
            //hide buttons
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        //Opposite of clearEdit State
        showEditState: function (){
            //show buttons
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
      
        //Expose the UISelector private property
        getSelectors: function(){
            return UISelectors;
        }
    }
    })();
//End of  UICtrl










//AppController
const AppCtrl = (function(ItemCtrl, UICtrl ){

    //LoadEventListeners - function expression
    const loadEvenetListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){   //13 is enter key
                e.preventDefault();
                return false;   //disable the enter key
            }
    });


        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clear Items evenr
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        //Back button even to clear out the state
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    

    }

    //Add Item Submit
    const itemAddSubmit = function(e){

       //Get form input from UICtrl
       const input =  UICtrl.getItemInput();

       //check for name and calorie input
       if(input.name !== '' && input.calories !== ''){
        //add Item
        const newItem = ItemCtrl.addItem(input.name, input.calories);
    
        //Add item to UI List
        UICtrl.addListItem(newItem);

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //clear fields
        UICtrl.clearInput();
       }
        e.preventDefault();
    }

    //click to edit item
    const itemEditClick = function(e){
        //event delegation
          if(e.target.classList.contains('edit-item')){
           //Get the list item id (item-0)
           const listId = e.target.parentNode.parentNode.id; //get grandparents id
           //Brake into an array and split it at the dash
           const listIdArr = listId.split('-');

           //get the actual id
           const id = parseInt(listIdArr[1]);

           //use id to get entire item Object
           const itemToEdit = ItemCtrl.getItemById(id);
           console.log(itemToEdit);
           //set surrent item
           ItemCtrl.setCurrentItem(itemToEdit);

           //Add item to form
           UICtrl.addItemToForm();

          }
        e.preventDefault();
    }

    //update Item Submit
    const itemUpdateSubmit = function(e){
        //get the item input
        const input = UICtrl.getItemInput();

        //update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        //then Update UI
        UICtrl.updateListItem(updatedItem);
        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){

        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
       //delete from UI
       UICtrl.deleteListItem(currentItem.id);

           //Get total Calories
           const totalCalories = ItemCtrl.getTotalCalories();

           //add totalCalories to UI
           UICtrl.showTotalCalories(totalCalories);
   
           UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function(){
        console.log('test');
        //Delete all items from ItemCtrl
        ItemCtrl.clearAllItems();

         //Remove from UI
         UICtrl.removeItems();

        //Update the Calories but first Get total Calories
         const totalCalories = ItemCtrl.getTotalCalories();

         //add totalCalories to UI
         UICtrl.showTotalCalories(totalCalories);

        //hide the UL
        UICtrl.hideList();

    }

  


  //PUBLIC BELOW - init anything we want to run when the application loads
  return{
      init: function(){

        //clear edit state / set initial state
        UICtrl.clearEditState();
    
        //Fetch Items from data structure
        const items = ItemCtrl.getItems();

        //check if any items exist
        if(items.length === 0){
                UICtrl.hideList();
        }else{
       //populate list with items
       UICtrl.populateItemList(items);
        }

          //Get total Calories
          const totalCalories = ItemCtrl.getTotalCalories();

          //add totalCalories to UI
          UICtrl.showTotalCalories(totalCalories);

        //Load all event listeners - fire!!!
        loadEvenetListeners();

      }
  }
})(ItemCtrl, UICtrl);  //pass here so it can invoke
//End of App Ctrl

//console.log(ItemCtrl.logData());
AppCtrl.init();