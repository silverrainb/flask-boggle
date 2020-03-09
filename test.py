from unittest import TestCase
from app import app
from flask import session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
app.debug = True
toolbar = DebugToolbarExtension(app)


class FlaskTests(TestCase):
    def test_home(self):
        client = app.test_client()
        result = client.get('/')
        self.assertEqual(result.status_code, 200)

    def test_score(self):
        with app.test_client() as client:
            res = client.post('/score')
            self.assertEqual(res.status_code, 200)

    def test_guess(self):
        with app.test_client() as client:
            res = client.post('/guess')
            self.assertEqual(res.status_code, 200)