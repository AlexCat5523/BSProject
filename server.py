from flask import Flask, url_for, render_template, redirect, request, jsonify
from functions import *


app = Flask(__name__)
app.config['SECRET_KEY'] = 'okok'


@app.route('/', methods=['GET', 'POST'])
def test():
    if request.method == 'POST':
        reqdata = request.data.decode('utf-8')
        arrows = genarrows(reqdata)
        additional_data = getadditionalinfo(reqdata)

        return {'info': arrows[0], 'arroworder': arrows[1], 'signs': additional_data}

    return render_template('web.html')


if __name__=='__main__':
    app.run(port=8000, host='127.0.0.1')