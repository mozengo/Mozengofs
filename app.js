async function loadMovies() {
  const res = await fetch('http://localhost:3000/api/movies');
  const movies = await res.json();
  const container = document.getElementById('movies');
  movies.forEach(m => {
    const div = document.createElement('div');
    div.className = 'movie';
    div.innerHTML = `<img src="${m.image}" alt="${m.title}"><h3>${m.title}</h3><p>${m.description}</p>`;
    container.appendChild(div);
  });
}
document.addEventListener('DOMContentLoaded', loadMovies);