import os

from flask import Flask, render_template, make_response, redirect, session
from flask_restful import Api, Resource, abort, reqparse

app = Flask(__name__, instance_relative_config=True)
api = Api(app)
app.config['SESSION_TYPE'] = 'filesystem'
app.secret_key = 'super secret key'


login_fields = reqparse.RequestParser()
login_fields.add_argument('username', required=True)
login_fields.add_argument('password', required=True)


class LoginPage(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('login.html'), 200, headers)

    def post(self):
        # Simulate database
        # Get account information from database
        usr = "foo"
        pwd = "37b51d194a7513e45b56f6524f2d51f2"
        args = login_fields.parse_args()
        print(args['password'])
        if args['username'] != usr or args['password'] != pwd:
            abort(401, message="Unauthorized")

        session['loggedin'] = True
        session['id'] = '1'  # account_id for db
        session['username'] = usr
        return '', 200


class HomePage(Resource):
    def get(self):
        # Check if user is logged in
        if 'loggedin' in session:
            return make_response(render_template('index.html', username=session['username']))
        return redirect("/login")


class MapPage(Resource):
    def get(self):
        if 'loggedin' in session:
            return make_response(render_template('map.html', username=session['username']))
        return redirect("/login")


class Logout(Resource):
    def get(self):
        session.pop('username', None)
        return redirect("/login")


class Stations(Resource):
    def get(self):
        if 'loggedin' in session:
            # Simulate database
            return {'1': {'station_name': 'DTC', 's_lat': 13.677004758076443, 's_lon': 100.60349091049797},
                    '2': {'station_name': 'BigC BangNa', 's_lat': 13.670020337750575, 's_lon': 100.63596179547086},
                    '3': {'station_name': 'Ohm apartment', 's_lat': 13.080748684139902, 's_lon': 100.4559177439804},
                    '4': {'station_name': 'CTL', 's_lat': 13.70977821365946, 's_lon': 100.49801155660597}
                    }

        return redirect("/login")


api.add_resource(HomePage, "/")
api.add_resource(MapPage, "/map")
api.add_resource(LoginPage, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(Stations, "/stations")
