///////////////////DATA MODULE///////////////////////////////
//Budget controller
var budgetController = (function(){

    var Expense = function(id, description, value){  //function constructor
        this.id = id,
        this.description = description,
        this.value = value
    };

    var Income = function(id, description, value){  //function constructor
        this.id = id,
        this.description = description,
        this.value = value
    };
    
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }

    };
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
             
            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }

            //Create new item base on inc or exp type.
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            //Push item into our data structures
            data.allItems[type].push(newItem);

            //return the new element
            return newItem; 
            
        },

    };

})();


////////////////////////////UI MODULE///////////////////////
//UI controller
var UIControler = (function(){

    var DOMstrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expenseContainer: '.expenses__list',
        incomeContainer: '.income__list'
    };


    return {
        getInput: function(){

            return {
                 type: document.querySelector(DOMstrings.inputType).value,  // Will be inc or exp
                 description:document.querySelector(DOMstrings.inputDescription).value,
                 value: document.querySelector(DOMstrings.inputValue).value        
            };
        },

        addListItem: function(obj, type){
          var html, newHtml, element;

            //Create HTML string with placeholder text
          if (type === 'inc'){
            element = DOMstrings.incomeContainer;

            html =  '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
        } else if (type === 'exp'){
            element = DOMstrings.expenseContainer;

            html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
          }

           
          //Replace the placeholder text with some actual dagta
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);
           
          
          //Insert the HTML into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
           var fields, fieldsArray;

           fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

           fieldsArray = Array.prototype.slice.call(fields);

           fieldsArray.forEach(function(current, index, array) {
               current.value = "";
           });

           fieldsArray[0].focus(); //places focus back on description
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();


//////////////////////////CONTROLLLER MODULE//////////////////
//Global Controller
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAdditem);
        document.addEventListener('keypress', function(event){

            if (event.keyCode == 13 || event.which == 13){
                ctrlAdditem();
            }
        });
    };



    var ctrlAdditem = function(){
        var input, newItem;
        //get input values
        input = UIControler.getInput();


        //add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //Add new item to user Interface
        UICtrl.addListItem(newItem, input.type);

        //Clear Fields
        UICtrl.clearFields();
        // Calc budget 
        //display the budget on UI

    };

    return {
        init: function(){
            console.log("Started");
            setupEventListeners();
        }
    };

})(budgetController, UIControler);

controller.init();

