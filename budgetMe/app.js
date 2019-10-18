///////////////////DATA MODULE///////////////////////////////
//Budget controller
var budgetController = (function(){

    var Expense = function(id, description, value){  //function constructor
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1
    };

    //calc percentages
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else {
            this.percentage = -1;
        }
    };

    //returns updated percentages
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value){  //function constructor
        this.id = id,
        this.description = description,
        this.value = value
    };
    
    var calculateTotal = function(type){
        var sum = 0; 
        data.allItems[type].forEach(function(current){
            sum += current.value; 
        });
        data.totals[type] = sum; 
    };

    //Global data model
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

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

        deleteItem: function(type, id){
            var ids, index;
            //create an arry that holds the id
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            //find index of id to match ID to the index
            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){

            //calculate total sums of income & expenses
            calculateTotal('exp');
            calculateTotal('inc');


            //calculate budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentage of income that we spent
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)) * 100
            } else {
                data.percentage= -1;
            }
        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            })
        },

        //return updated calc percentage
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }

    };

})();


////////////////////////////UI MODULE///////////////////////
//UI controller
var UIControler = (function(){

    //DOM class variables
    var DOMstrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expenseContainer: '.expenses__list',
        incomeContainer: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensePercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec, type;

        // exactly 2 decimal points
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        //comma separating the thousands
        int = numSplit[0];
        if(int.length > 3){
           int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        //+ or - before the number

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + "."+  dec;
        
    };

                //loop and mutate through percentages array
                var nodeListForEach = function(list, callback){
                    for(var i = 0; i < list.length; i++){
                        callback(list[i], i);
                    }
                };


    return {
        getInput: function(){

            return {
                 type: document.querySelector(DOMstrings.inputType).value,  // Will be inc or exp
                 description:document.querySelector(DOMstrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value)        
            };
        },

        addListItem: function(obj, type){
          var html, newHtml, element;

            //Create HTML string with placeholder text
          if (type === 'inc'){
            element = DOMstrings.incomeContainer;

            html =  '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
        } else if (type === 'exp'){
            element = DOMstrings.expenseContainer;

            html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
          }

           
          //Replace the placeholder text with some actual dagta
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
          
          //Insert the HTML into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

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

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages: function(percentages){

            //storing the nodelist
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);

            nodeListForEach(fields, function(current, index){

                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = percentages[index] + '--';
                }
            });



        },

        displayMonth: function(){
            var now, months,month, year
            //store date of today
            now = new Date();

            months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+  year;
            

        },

        changeType: function(){

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            
            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
    };

    var updateBudget = function(){

        // Calc budget 
        budgetCtrl.calculateBudget();

        // return budget
        var budget = budgetCtrl.getBudget();

        //display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){

        //Calculate percentages
        budgetController.calculatePercentages();

        //read from budget controller
        var percentages = budgetCtrl.getPercentages();
        //update user interface
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAdditem = function(){
        var input, newItem;
        //get input values
        input = UIControler.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        //add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //Add new item to user Interface
        UICtrl.addListItem(newItem, input.type);

        //Clear Fields
        UICtrl.clearFields();

        //Calc and update budget
        updateBudget(); 

        //calc & update percentages
        updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

        //read target property from event
        //store id within variable
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            //Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //Update and show the new budget
            updateBudget(); 

            //calc & update percentages
            updatePercentages();

        }
    };
    return {
        init: function(){
            console.log("Started");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
            });

            setupEventListeners();
        }
    
    };

})(budgetController, UIControler);

controller.init();

