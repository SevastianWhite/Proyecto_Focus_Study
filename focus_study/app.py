#Añadiendo HTML con Flask

from flask import Flask, render_template, redirect, url_for
import csv
import os


app = Flask(__name__)

@app.route("/", methods=["get", "post"])


@app.route("/")
def login():
    return render_template("inicio.html")

@app.route("/dashboar")
def dashboard():
    return render_template("quienesomos.html")

@app.route('/ir-a-dashboard')
def ir_a_dashboard():
    return redirect(url_for('dashboard'))

app.run(debug=True)