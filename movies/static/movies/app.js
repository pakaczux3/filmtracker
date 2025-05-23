const API = '/api/movies/';
const toWatchList = document.getElementById('to-watch-list');
const watchedList = document.getElementById('watched-list');

async function loadMovies() {
    const res = await fetch(API);
    const data = await res.json();

    toWatchList.innerHTML = '';
    watchedList.innerHTML = '';

    data.forEach(movie => {
        const li = document.createElement('li');
        li.style.position = 'relative';

        const title = document.createElement('strong');
        li.textContent = movie.title;

        const description = document.createElement('p');
        description.textContent = movie.description;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Usuń';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '10px';
        deleteBtn.style.right = '10px';
        deleteBtn.style.backgroundColor = 'red';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.onclick = () => deleteMovie(movie.id);

        li.appendChild(deleteBtn);
        li.appendChild(title);
        li.appendChild(description);

        if (movie.status === 'to_watch') {
            const btn = document.createElement('button');
            btn.textContent = '✅ Obejrzane';
            btn.onclick = () => updateMovie(movie.id, {status: 'watched'});
            li.appendChild(btn);
            toWatchList.appendChild(li);
        } else {
            const ratingLabel = document.createElement('label');
            ratingLabel.textContent = 'Ocena: ';
            const rating = document.createElement('input');
            rating.type = 'number';
            rating.min = 1;
            rating.max = 10;
            rating.value = movie.rating || '';
            rating.placeholder = "Ocena";
            rating.onchange = () => updateMovie(movie.id, {rating: rating.value});

            const reviewLabel = document.createElement('label');
            reviewLabel.textContent = 'Recenzja: ';
            const review = document.createElement('textarea');
            review.placeholder = "Recenzja";
            review.value = movie.review || '';
            review.onchange = () => updateMovie(movie.id, { review: review.value });

            li.appendChild(ratingLabel);
            li.appendChild(rating);
            li.appendChild(reviewLabel);
            li.appendChild(review);
            watchedList.appendChild(li);
        }
    });
}

async function addMovie(title, description) {
    await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({title, description, status: 'to_watch'})
    });
    loadMovies();
}

async function updateMovie(id, update) {
    await fetch(`${API}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(update)
    });
    loadMovies();
}

async function deleteMovie(id) {
    await fetch(`${API}${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    });
    loadMovies();
}

document.getElementById('add-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const desc = document.getElementById('description').value;
    addMovie(title, desc);
    title.value = '';
    desc.value = '';
});

function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

loadMovies();
