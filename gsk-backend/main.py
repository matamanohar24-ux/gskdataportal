from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}

@app.route("/transform/tall-to-wide", methods=["POST"])
def transform():
    payload = request.json or {}
    rows = payload.get("rows", [])
    columns = payload.get("columns", [])

    # POC response (replace later with real logic)
    return jsonify({
        "message": "Transformation successful",
        "input_row_count": len(rows),
        "input_columns": columns,
        "sample_output": rows[:5]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
