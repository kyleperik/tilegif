function flash(text) {
    var $flash = document.querySelector('.flash_message');
    $flash.textContent = text;
    $flash.style.opacity = 1;
    setTimeout(() => {
        $flash.style.opacity = 0;
    }, 6000);
}

function get_random_gif_url(query) {
    return new Promise((resolve, reject) => {
        var limit = 25;
        fetch(`/gif?q=${query}`)
        .then((r) => {
            if (!r.ok) { throw r.statusText }
            return r.text();
        })
        .then((result) => {
            var preload_img = new Image();
            preload_img.src = result;
            preload_img.onload = () => resolve(result);
        })
        .catch(() => flash('No Results'));
    });
}

window.addEventListener('load', () => {
    document.querySelector('button#K').addEventListener('click', () => {
        var query = document.querySelector('input#Search').value;
        get_random_gif_url(query)
            .then((gif) => {
                document.querySelector('body').style.background = `url(${gif})`;
            });
    });
});
