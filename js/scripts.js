// document.getElementsByClassName("addToCart").addEventListener("click",cartAdd);
// function cartAdd(){
//     console.log(this.value);
// }; working but only for a single button

// document.querySelectorAll('.addToCart').forEach(itme =>{
//     item.addEvnetListener('click',cartAdd);
// });

// function cartAdd(){
//     console.log(this.value);
// };

[...document.querySelectorAll('.addToCart')].forEach(function(item) {
    item.addEventListener('click', function() {
      console.log(item.value);
    });
     });

//above adds event listeners to all buttons with class addToCart
// will be used in the future to parse the button value element into a int to add to cart 
//where i found solution that worked eventually https://stackoverflow.com/questions/51573435/want-to-add-addeventlistener-on-multiple-elements-with-same-class