var flash_counter = 0;
function flash(text) {
    flash_counter++;
    var $flash = document.querySelector('.flash_message');
    $flash.textContent = text;
    $flash.style.opacity = 1;
    return {
        stop: () => {
            if (--flash_counter <= 0) {
                $flash.style.opacity = 0;
            }
        }
    };
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
        .catch(() => {
            var no_results = flash('No Results');
            setTimeout(() => no_results.stop(), 6000);
            reject();
        });
    });
}

function load_image () {
    var query = document.querySelector('input#Search').value;
    var loading_flash;
    var show_loading = setTimeout(() => {
        loading_flash = flash('Loading...');
    }, 1000);
    get_random_gif_url(query)
    .then((gif) => {
        document.querySelector('body').style.backgroundImage = `url(${gif})`;
    })
    .catch(() => {})
    .then(() => {
        clearTimeout(show_loading);
        if (loading_flash) {
            loading_flash.stop();
        }
    });
}

function init () {
    document.querySelector('button#K').addEventListener('click', load_image);
    document.querySelector('input#Search').addEventListener('keypress', (e) => {
        if (e.which === 13) {
            load_image();
        }
    });
}

window.addEventListener('load', init);
