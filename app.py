from flask import Flask, request, render_template, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os
from PIL import Image

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('cnn_5_model.keras')

# Define image dimensions
img_height, img_width = 250, 250  # Same as used during training

# Preprocess the image
def preprocess_image(image):
    img = image.resize((img_height, img_width))  # Resize the image
    img_array = img_to_array(img)  # Convert the image to a numpy array
    img_array = img_array / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Route to upload and predict image
@app.route("/", methods=["GET", "POST"])
def upload_image():
    if request.method == "POST":
        if 'file' not in request.files:
            return jsonify({"error": "No file part"})
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"})
        
        if file:
            try:
                # Read the image using PIL
                image = Image.open(file.stream)
                
                # Preprocess and predict
                preprocessed_image = preprocess_image(image)
                prediction = model.predict(preprocessed_image)
                predicted_class = np.argmax(prediction, axis=1)
                
                return jsonify({"predicted_class": int(predicted_class)})
            except Exception as e:
                return jsonify({"error": str(e)})
    
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
