async function register(e) {
  e.preventDefault();
  const res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      role: document.getElementById('role') ? document.getElementById('role').value : 'user'
    })
  });
  alert((await res.json()).message || (await res.json()).error);
}
async function login(e) {
  e.preventDefault();
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  if(data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = 'creator.html';
  } else {
    alert(data.error);
  }
}
document.getElementById('registerForm')?.addEventListener('submit', register);
document.getElementById('loginForm')?.addEventListener('submit', login);