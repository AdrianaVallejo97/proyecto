document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  // Usuarios de ejemplo: ash/pikachu, misty/togepi, brock/onix
  if((user==='ash' && pass==='pikachu') || (user==='misty' && pass==='togepi') || (user==='brock' && pass==='onix')){
    // store user for welcome
    localStorage.setItem('pokemon_user', user);
    location.href = "app.html";
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});
