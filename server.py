from flask import Flask, url_for, render_template, redirect, request, jsonify
from functions import *


app = Flask(__name__)
app.config['SECRET_KEY'] = 'kusya_durnusya'


@app.route('/test', methods={'GET', 'POST'})
def index():
    user = 'Саша'
    title = 'Сайтик'
    message = ''

    if request.method == "POST":
        if "action1" in request.form:
            message = "Ура"
            
    return render_template('index.html', username=user, title=title, message=message)



@app.route('/', methods=['GET', 'POST'])
def test():
    if request.method == 'POST':
        reqdata = request.data.decode('utf-8')
        arrows = genarrows(reqdata)

        return {'info': arrows[0], 'arroworder': arrows[1]}

    return render_template('test.html')


if __name__=='__main__':
    app.run(port=8000, host='127.0.0.1')