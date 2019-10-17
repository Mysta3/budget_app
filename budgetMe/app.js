///////////////////DATA MODULE///////////////////////////////
//Budget controller
var budgetController = (function(){

    //some code
   
})();


////////////////////////////UI MODULE///////////////////////
//UI controller
var UIControler = (function(){

    //code

})();


//////////////////////////CONTROLLLER MODULE//////////////////
//Global Controller
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAdditem = function(){

        //get input values
        //add item to budget controller
        //Add new item to user Interface
        // Calc budget 
        //display the budget on UI

    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAdditem);
 
    document.addEventListener('keypress', function(event){

        if (event.keyCode == 13 || event.which == 13){
            ctrlAdditem();
        }
    })

})(budgetController, UIControler);



