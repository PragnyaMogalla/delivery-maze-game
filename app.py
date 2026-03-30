from flask import Flask, render_template, request, jsonify
from solver import solve_maze_ucs

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/solveMaze', methods=['POST'])
def solve_maze():
    data = request.json
    result = solve_maze_ucs(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)