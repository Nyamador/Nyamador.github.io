import requests
import json


def create_mux_asset(token='6c2116a7-38b9-4ca2-9c7f-dedc8e023883' , key='Pu3P7NIjcpRfhdAryK5zQq3iT0GL7haP4vnCfoCCtAQ8Y0hK+2j/ODpO5mLzUo9GjB3b/75tVeF'):
	video_url = 'http://movietrailers.apple.com/movies/wb/the-lego-ninjago-movie/the-lego-ninjago-movie-trailer-2_h720p.mov'
	response = requests.post('https://api.mux.com/video/v1/assets', data = video_url , auth=('username', getpass()))

	print(response.json())


create_mux_asset()