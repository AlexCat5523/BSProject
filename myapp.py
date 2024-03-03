from flask import Flask, url_for, render_template, redirect, request, jsonify, make_response
from functions import *
from flask_cors import cross_origin


app = Flask(__name__)
# app.config['SECRET_KEY'] = '34y5h23k46yu'


# запускает приложение
@app.route('/', methods=['GET', 'POST', 'FETCH'])
@cross_origin()
def main():
    if request.method == 'POST':
        reqdata = request.data.decode('utf-8')
        arrows = genarrows(reqdata)
        
        return make_response({'info': arrows[0], 'arroworder': arrows[1]})

    return render_template('web.html')


if __name__=='__main__':
    app.run()