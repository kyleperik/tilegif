from flask import Flask, request, render_template
import requests
from functools import lru_cache
from random import randint

app = Flask(__name__)

app.config.from_envvar('TILEGIF_SETTINGS')

giphy_api_key = app.config.get('GIPHY_API_KEY')
giphy_api_url = 'https://api.giphy.com/v1'
giphy_gif_limit = 20
if giphy_api_key is None:
    print('WARNING: No giphy api key provided')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/what')
def what():
    return render_template(
        'what.html',
        github_url = app.config.get('GITHUB_URL')
    )

@lru_cache(maxsize=100)
def get_gif_urls(query):
    url = f'{giphy_api_url}/gifs/search'
    response = requests.get(url, {
        'api_key': giphy_api_key,
        'q': query,
        'limit': giphy_gif_limit,
    }).json()
    return [
        img['images']['original']['url']
    for img in response['data']]

def random_gif(query):
    urls = get_gif_urls(query)
    max_index = len(urls) - 1
    if max_index == -1:
        raise Exception('No Results')
    else:
        index = randint(0, len(urls) - 1)
        return urls[index]

@app.route('/gif')
def gif():
    query = request.args.get('q')
    return random_gif(query)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
