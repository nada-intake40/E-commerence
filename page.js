
console.log('in page.js');
let productsInCart,totalCost;
//let products;
var path = window.location.pathname;
var pagesrc = path.split("/").pop();
console.log(pagesrc);

let urlPage='https://afternoon-falls-30227.herokuapp.com/api/v1/products/';
let cartItems=parseInt(localStorage.getItem('cartNumbers')); 
if(!cartItems)
{
  localStorage.setItem('cartNumbers', 0);
}



$(function(){
	let page = 1,
		limit = 10,
		totalrecord = 0;

if (document.querySelector('.cart span')) {
	document.querySelector('.cart span').textContent = cartItems
}
// to hide prev button at start 
	if(page==1)
		{
		   $(".prev-btn").hide();
		}

	let category,supplier;
	// here we get all categories and suppliers name
	const xhr = new XMLHttpRequest();
	xhr.open('GET',"https://afternoon-falls-30227.herokuapp.com/api/v1/products-stats/");
	xhr.send();
	xhr.onload = ()=>{
		let productDetails = JSON.parse(xhr.response);
		category =productDetails.data.Groups.Category;
		category=Object.keys(category);
// add categories to drop down list callled category 
		for(let j=0;j<category.length;j++)
		{
		$("#category .dropdown-menu").append(`<a class="dropdown-item" href="#">${category[j]}</a>`);
		}
		supplier =productDetails.data.Groups.SupplierName;
		supplier=Object.keys(supplier);
// add suppliers name to drop down list called supplier
		for(let j=0;j<supplier.length;j++)
		{
		$("#supplier .dropdown-menu").append(`<a class="dropdown-item" href="#">${supplier[j]}</a>`);
		}


if(pagesrc !== "view.html") {
	 fetchData();
}
// form actions by clicking on supplier name
		$("#supplier .dropdown-item").click(function()
		{   page=1;
			let supplierName = $(this).text();
			urlPage=`https://afternoon-falls-30227.herokuapp.com/api/v1/products?supplier=${supplierName}`;
			$("div .col").remove();
			fetchData();
		});


// form action by clicking on category name
		$("#category .dropdown-item").click(function()
		{   page=1;
			let categoryName =$(this).text();
			urlPage=`https://afternoon-falls-30227.herokuapp.com/api/v1/products?category=${categoryName}`;
			$("div .col").remove();
			fetchData();
		});

	  
   
// handling the prev-btn
	   $(".prev-btn").on("click", function(){
		   if (page > 1) {
			   page--;
			   $("div .col").remove();
			   fetchData();
			   $(".next-btn").show();
		   }
		   if(page<=1)
		   {
			   $(".prev-btn").hide();
		   }
	   });
   
// handling the next-btn
	   $(".next-btn").on("click", function(){
		   if (page < totalrecord) {
			   page++;
			   $("div .col").remove();
			   fetchData();
			   $(".prev-btn").show();
		   }if(page>=totalrecord)
		   {
			   $(".next-btn").hide();
		   }
	   });
	
	getTotalCost();
// check out action
	$("#side").append(`${cartItems} items  ,  EGP${totalCost}  <a href='his.html' id='checked'>Checkout</a>`);

	function fetchData() {
		// ajax() method to make api calls
		$.ajax({
			url: urlPage,
			type: "GET",
			data: {
				page: page,
				limit: limit
			},
			success: function(response) {
				// console.log(response);
				if (response.data) {
					let dataArr = response.data;
					products = response.data;
					console.log(products);
					totalrecord = response.total_pages;
					console.log(totalrecord );
	// condition to hide prev button in case if page=1				
				if(urlPage!='https://afternoon-falls-30227.herokuapp.com/api/v1/products/')
					{   
						if(page==1)
						{$(".prev-btn").hide();}
						
						if(totalrecord == 1)
						{
							$(".next-btn").hide();
							$(".prev-btn").hide();
						}
						else if(page==totalrecord )
						{
							$(".next-btn").hide();
						}
						else
						{
						 $(".next-btn").show();
						}
					}
					const count = dataArr.length;
					for (let i = 0; i < count; i++) {
						$("#main").append(`<div class='col col-md-3 my-5 mx-3' id='num${i}'></div>`);
						let imgg = document.createElement("img");
						let price = document.createElement("span");
						let name = document.createElement("p");
						let category=document.createElement("p");
						let supply=document.createElement("p");
						let Btn =document.createElement('button');
						imgg.setAttribute("src",dataArr[i].ProductPicUrl);
						name.textContent=dataArr[i].Name ;
						price.textContent= dataArr[i].Price+"$";
					    supply.textContent='supplier :'+dataArr[i].SupplierName;
						category.textContent='category :'+dataArr[i].Category;
						$(`#num${i}`).append(category);
						$(`#num${i}`).append(supply);
						$(`#num${i}`).append(name);
						$(`#num${i}`).append(imgg);
						$(`#num${i}`).append(price);
						$(`#num${i}`).append(Btn);
						$(`#num${i} span`).css("padding-right","300px").css("padding-left","10px");
						$(`#num${i} button`).attr("id",`${dataArr[i].ProductId}`);
						$('img').wrap("<a id='link'> </a>");
						$(`#num${i} button`).attr("class",`btn btn-outline-info rounded-circle`);
						$(`#num${i} #${dataArr[i].ProductId}`).append("<i class='fa fa-cart-plus'></i>");
						let x = $(`#num${i} #${dataArr[i].ProductId}`);
						Btn.addEventListener('click',()=>
						{  addToCart(dataArr[i],1);
							if (dataArr[i].Quantity >0) {
								dataArr[i].Quantity--; 
							} else{
								x.attr('disabled',true);
							}
						}); 
						imgg.addEventListener('click',()=>{
							let strLink = "view.html?" + dataArr[i].ProductId;
							$('a').attr("href",strLink);
						console.log(strLink);
						});
					}   
	//styling of home page
					$("button").css("margin-bottom","30px");
					$("#main img").attr({"width":"400px","height":"400px"}).css("padding","50px");
					$('#main .col').css("background-color","#e9ecef").css("border-radius","10%");
					$("p").css("color","blue").css("font-weight","bold").css("padding-top","15px");
					$('#main span').css("color","red");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
 }
});

// function to add to cart products
function addToCart(prod,q,redirect) {
    saveProducts();
    if(productsInCart!= null){
         if(`${prod.ProductId}` in productsInCart )
         {
             productsInCart[prod.ProductId].amount +=q;
         }else
         {
            let product ={
				id:prod.ProductId,
                productName:prod.Name,
                amount:q,
                productPrice:prod.Price,
                productCat:prod.Category,
                supplierName:prod.SupplierName,
                photo:prod.ProductPicUrl
            }
            productsInCart={
                ...productsInCart,
                [prod.ProductId]:product
            }
        }
	}
	
    else{ // in case it is the first product i put in cart
        productsInCart={
            [prod.ProductId]:{
				id:prod.ProductId,
				productName:prod.Name,
				amount:q,
				productPrice:prod.Price,
				productCat:prod.Category,
				supplierName:prod.SupplierName,
				photo:prod.ProductPicUrl
			}
        }
    }
	cartItems=cartItems+q;
    localStorage.setItem('productInCart', JSON.stringify(productsInCart));
	localStorage.setItem('cartNumbers', cartItems);
	if(document.querySelector('.cart span')) {
		document.querySelector('.cart span').textContent=cartItems; 
	}

	getTotalCost(); 
	$("#side").html(`${cartItems} items  ,  EGP${totalCost}  <a href='his.html' id='checked'>Checkout</a>`);  
	
	if(redirect) {
		window.location = "cart.html";
	} 
}


// to get all info from local storage
function saveProducts(){
    productsInCart={};
    productsInCart=localStorage.getItem('productInCart');
    productsInCart=JSON.parse(productsInCart);
    cartItems=parseInt(localStorage.getItem('cartNumbers'));
}

// function to get total cost of products in cart
function getTotalCost()
{  totalCost=0;
	saveProducts();
    for(let element in productsInCart) {
		totalCost+=productsInCart[element].amount*productsInCart[element].productPrice;
	}
}

// function used to display data in cart
function displayCart(){
	getTotalCost();
	if( productsInCart){
		$(".products-container").html("");
        Object.values(productsInCart).map(item => {
			$(".products-container").append(` 
            <div class="product">
			  <button style="font-size:30px; color:darkcyan;" class="btn rounded-circle" id=${item.id}>
			  <i class="fa fa-times-circle"></i></button>
            <img src="${item.photo}" width="200px" height="200px">
            </div>
            <div class="price"> EGP${item.productPrice},00 </div>
            <div class="quantity">
            <span>${item.amount}</span>
            </div>
            <div class="total">
            EGP${item.amount * item.productPrice},00
            </div>`)
		});
// to remove item from cart by clicking the button
		$(".product button").click(function()
		{
			// console.log( $(".product button"));
			prodId = $(this).attr("id");
			console.log(prodId);
			removeItembyId(prodId);
	    });
		$(".products-container").append(` 
        <div class="basketTotalContainer">
        <h5 class="basketTotalTitle">Total Cost</h5>
        <h5 class="basketTotal"> EGP${totalCost},00</h5>
		</div>`);
		
		$("#checkcart").show();

	}else{
		$("#checkcart").hide();
	}
	if(document.querySelector('.cart span')) {
		document.querySelector('.cart span').textContent = cartItems;
	}
	
}


// function that called when click on button to remove item from cart
function removeItembyId(id)
{  saveProducts();
	if(`${id}` in productsInCart )
	 {  cartItems-=productsInCart[id].amount;
		delete productsInCart[id];}
	localStorage.setItem('productInCart', JSON.stringify(productsInCart));
    localStorage.setItem('cartNumbers', cartItems);       
	displayCart()
}




 if(pagesrc === 'cart.html') {
displayCart();
 }



$(document).ready(function() {
 $("#do-search").click(function(){
        // alert("button");
        // console.log(products);
        let productId = $("#searchBy").val();
        console.log(productId);

        let navigateTo = "view.html?" + productId;
        console.log(navigateTo);

        window.location =navigateTo;
    });
});



