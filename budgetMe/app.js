///////////////////DATA MODULE///////////////////////////////

var budgetController = (function(){

    var x = 23;

    var add = function(a){
        return x + a; 
    }

        return {
            name: "john",
            publicTest: function(b){
                return add(b); 
            }
        }
})();


////////////////////////////UI MODULE///////////////////////

var UIControler = (function(){

    //code

})();


//////////////////////////CONTROLLLER MODULE//////////////////

var controller = (function(budgetCtrl, UICtrl){

   var z =  budgetCtrl.publicTest(5);
    
    return {
        anotherPublic: function(){
            console.log(z); 
        }
    }

})(budgetController, UIControler);

