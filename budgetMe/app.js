///////////////////DATA MODULE///////////////////////////////
//Budget controller
var budgetController = (function(){

    //some code
   
})();


////////////////////////////UI MODULE///////////////////////
//UI controller
var UIControler = (function(){

    var DOMstrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };


    return {
        getInput: function(){

            return {
                 type: document.querySelector(DOMstrings.inputType).value,  // Will be inc or exp
                 description:document.querySelector(DOMstrings.inputDescription).value,
                 value: document.querySelector(DOMstrings.inputValue).value        
            };
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();


//////////////////////////CONTROLLLER MODULE//////////////////
//Global Controller
var controller = (function(budgetCtrl, UICtrl){

        var DOM = UICtrl.getDOMstrings();

    var ctrlAdditem = function(){

        //get input values
        var input = UIControler.getInput();
        console.log(input);



        //add item to budget controller
        //Add new item to user Interface
        // Calc budget 
        //display the budget on UI

    }
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAdditem);
 
    document.addEventListener('keypress', function(event){

        if (event.keyCode == 13 || event.which == 13){
            ctrlAdditem();
        }
    })

})(budgetController, UIControler);



