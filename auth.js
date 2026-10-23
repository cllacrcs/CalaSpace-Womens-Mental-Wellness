function register(){
 const name=document.getElementById('name').value;
 const email=document.getElementById('email').value;
 const password=document.getElementById('password').value;

 const user={name,email,password};
 localStorage.setItem('calaspaceUser',JSON.stringify(user));

 alert('Registration success');
 window.location='login.html';
}

function login(){
 const email=document.getElementById('email').value;
 const password=document.getElementById('password').value;

 const user=JSON.parse(localStorage.getItem('calaspaceUser'));

 if(user && user.email===email && user.password===password){
   localStorage.setItem('loggedIn','true');
   window.location='index.html';
 }else{
   alert('Wrong email or password');
 }
}