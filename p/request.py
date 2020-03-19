import requests
import json


def send_mail():

	response = requests.post("https://api.mailgun.net/v3/sandbox1118746407a347a1b579f7a545e2f6c4.mailgun.org/messages", 
	auth=('api', 'a7fb3059e68a03b1c1c9f0a12ac9d22b-9dfbeecd-aa8f8dc2'),
	data = {"from": "mailgun@sandbox1118746407a347a1b579f7a545e2f6c4.mailgun.org",
			"to": ["dselasi4u@gmail.com", "selanyamador@gmail.com"],
			"subject": "Desmond Nyamador",
			"text": "Testing some Mailgun awesomness through the api!"})

	print(response.json())


send_mail()