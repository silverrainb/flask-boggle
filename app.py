from flask import Flask, request, render_template, session
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension
import pdb
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = "bogglebogglebooooobooogleeee"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)


boggle_game = Boggle()

@app.route("/")
def home():
    """board instance is created in main page"""
    
    board = boggle_game.make_board()
    session['board'] = board
    return render_template("index.html", board=board)


@app.route("/score", methods=['POST'])
def score():
    """request score and total plays data"""

    if request.data:
        req = json.loads(request.data)
        score = req['score']
        total_plays = req['totalPlays']
        my_result = {"score": score,
                     "total_plays": total_plays}
        return (my_result)
    else:
        "NOT OK", 400


@app.route("/guess", methods=['POST'])
def guess():
    """request guess-words input and result whether it's correct"""

    if request.data:
        req = json.loads(request.data)
        user_input = req['guess']
        print("user_input:", user_input)

        board = session['board']
        response = boggle_game.check_valid_word(board=board, word=user_input)
        print(response)
        my_result = {"user_input": user_input,
                     "result": response}
        return my_result
    else:
        return "NOT OK", 400