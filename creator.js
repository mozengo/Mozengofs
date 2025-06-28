document.getElementById('movieForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/movies', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      title: document.getElementById('title').value,
      image: document.getElementById('image').value,
      description: document.getElementById('description').value
    })
  });
  const data = await res.json();
  alert(data.message || data.error);
});