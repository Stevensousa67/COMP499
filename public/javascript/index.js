window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        loading = true;
        page++;
        loadMoreCampgrounds(page);
    }
});

function loadMoreCampgrounds(page) {
    fetch(`/campgrounds?page=${page}`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(response => response.json())
        .then(campgrounds => {
            if (campgrounds.length === 0) {
                // No more campgrounds to load
                return;
            }
            const container = document.getElementById('campgrounds-container');
            campgrounds.forEach(campground => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="row">
                        <div class="col-md-4">
                            ${campground.images.length ?
                                `<img class="img-fluid" alt="" src="${campground.images[0].url}">` :
                                `<img class="img-fluid" alt="" src="/images/default.jpg">`}
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${campground.title}</h5>
                                <p class="card-text">${campground.description}</p>
                                <p class="card-text"><small class="text-muted">${campground.location}</small></p>
                                <a href="/campgrounds/${campground._id}" class="btn btn-primary">View ${campground.title}</a>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            loading = false;
        })
        .catch(error => {
            console.error('Error fetching campgrounds:', error);
            loading = false;
        });
}