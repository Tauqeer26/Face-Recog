from flask import Flask, request, render_template, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
import os
from PIL import Image
import cv2
import io

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('cnn_5_model.keras')

# Load OpenCV's pre-trained face detector (Haar Cascade)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Define image dimensions for the model
img_height, img_width = 250, 250  # Same as used during training

# Define label mapping
labels = {0: "Faraz", 1: "Imran", 2: "Shahzeb"}

# Preprocess the face image for prediction
def preprocess_image(face_image):
    face_image = face_image.resize((img_height, img_width))  # Resize to the input size expected by the model
    img_array = img_to_array(face_image)  # Convert to numpy array
    img_array = img_array / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Detect faces in the image using OpenCV
def detect_faces(image):
    # Convert the PIL image to a NumPy array for OpenCV processing
    img_array = np.array(image.convert('RGB'))  # Convert to RGB if not already in that format
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)  # Convert to grayscale for face detection

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    return faces

# Crop the face from the image
def crop_face(image, face_coordinates):
    x, y, w, h = face_coordinates
    return image.crop((x, y, x + w, y + h))  # Crop the face from the image

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
                
                # Detect faces in the image
                faces = detect_faces(image)
                
                if len(faces) == 0:
                    return jsonify({"error": "No face detected in the image"})
                
                # Use the first detected face (if multiple faces are detected)
                face_coordinates = faces[0]
                face_image = crop_face(image, face_coordinates)
                
                # Preprocess and predict
                preprocessed_face = preprocess_image(face_image)
                prediction = model.predict(preprocessed_face)
                predicted_class = np.argmax(prediction, axis=1)[0]
                
                # Map predicted class to the name
                person_name = labels.get(predicted_class, "Unknown")
                
                return jsonify({"The person name is": person_name})
            except Exception as e:
                return jsonify({"error": str(e)})
    
    return render_template("index2.html")

if __name__ == "__main__":
    app.run(debug=True)
