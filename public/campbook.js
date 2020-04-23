// rating

var ratingStars = document.querySelectorAll(".ratingstars")

ratingStars.forEach((e,index) => {
  referencedRate = document.getElementById("rate").value
  if(referencedRate!=""){
    for(var i = 0; i<referencedRate; i++){
      ratingStars[i].style.color =  "#FF8C00";
      ratingStars[i].classList.add("fas");
    }
    for(var i = referencedRate; i<=4; i++){
      ratingStars[i].style.color =  "";
      ratingStars[i].classList.remove("fas");
    }
  }
  e.addEventListener("click", function(){
    for (var i= 0; i<=index; i++ ){
      ratingStars[i].style.color =  "#FF8C00";
      ratingStars[i].classList.add("fas");
    }
    for (var i= index+1; i<=4; i++ ){
      ratingStars[i].style.color =  "";
      ratingStars[i].classList.remove("fas");
    }
    document.getElementById("rate").value = index+1
  })
  e.addEventListener("mouseenter", function(){
      for (var i= 0; i<=index; i++ ){
        ratingStars[i].style.color =  "#FF8C00";
      }
      for (var i= index+1; i<=4; i++ ){
        ratingStars[i].style.color =  "";
        ratingStars[i].classList.remove("fas")
      }

  })
  e.addEventListener("mouseleave", function(){
    var refRateLeave = document.getElementById("rate").value
    if(refRateLeave != ""){
      for (var i= 0; i<refRateLeave; i++ ){
        ratingStars[i].style.color = "#FF8C00";
        ratingStars[i].classList.add("fas")
      }
      for (var i= refRateLeave; i<=4; i++ ){
        ratingStars[i].style.color =  "";
      }
    }else{
      for (var i= 0; i<5; i++ ){
        ratingStars[i].style.color = "";
      }
    }
  

  })
});

//

var crudIcon = document.querySelectorAll(".crud-icon")

crudIcon.forEach(e =>{
  e.addEventListener("mouseenter",()=>{
    e.classList.remove("fas")
    e.classList.add("far")
  })
  e.addEventListener("mouseleave",()=>{
    e.classList.remove("far")
    e.classList.add("fas")
  })
})




// validation 


document.getElementById("rate").addEventListener("invalid", ()=>{
  document.getElementById("rate").setCustomValidity("Please rate Your CampPost")
})
document.getElementById("rate").addEventListener("change", ()=>{
  document.getElementById("rate").setCustomValidity(" ")
})



//Image Preview JS

var fileUpload = document.getElementById("customFile")

fileUpload.addEventListener("change", previewImage)

function previewImage(){
  for(var i = 0; i<fileUpload.files.length; i++){
    var fileType = ["image/jpeg", "image/png","image/jpg"]
    var file = fileUpload.files[i];
    if(fileType.includes(file.type) === true){
      var reader = new FileReader();
      reader.onload = function(e){
        var newformImg = new Image();//
        newformImg.src = e.target.result;
        document.getElementById("newformImg").appendChild(newformImg);
      }
      reader.readAsDataURL(file);
    }
  
  }
}

//





