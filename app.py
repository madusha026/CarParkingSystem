import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
import easyocr
import util as util
from flask_cors import CORS 

# Flask App
app = Flask(__name__)

CORS(app)

# Load model once
model_cfg_path = os.path.join('model', 'cfg', 'darknet-yolov3.cfg')
model_weights_path = os.path.join('model', 'weights', 'model.weights')
class_names_path = os.path.join('model', 'class.names')

# Load class names
with open(class_names_path, 'r') as f:
    class_names = [line.strip() for line in f.readlines() if len(line.strip()) > 0]

# Load YOLO model
net = cv2.dnn.readNetFromDarknet(model_cfg_path, model_weights_path)

# EasyOCR Reader
reader = easyocr.Reader(['en'])

@app.route('/detect', methods=['POST'])
def detect_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
    
    if img is None:
        return jsonify({'error': 'Invalid image'}), 400

    H, W, _ = img.shape
    blob = cv2.dnn.blobFromImage(img, 1 / 255, (416, 416), (0, 0, 0), True)
    net.setInput(blob)
    detections = util.get_outputs(net)

    bboxes, class_ids, scores = [], [], []

    for detection in detections:
        bbox = detection[:4]
        xc, yc, w, h = bbox
        bbox = [int(xc * W), int(yc * H), int(w * W), int(h * H)]

        class_id = np.argmax(detection[5:])
        score = np.amax(detection[5:])

        bboxes.append(bbox)
        class_ids.append(class_id)
        scores.append(score)

    bboxes, class_ids, scores = util.NMS(bboxes, class_ids, scores)

    results = []

    for i, bbox in enumerate(bboxes):
        xc, yc, w, h = bbox
        x1, y1 = int(xc - w / 2), int(yc - h / 2)
        x2, y2 = int(xc + w / 2), int(yc + h / 2)

        license_plate = img[y1:y2, x1:x2].copy()
        license_plate_gray = cv2.cvtColor(license_plate, cv2.COLOR_BGR2GRAY)
        _, license_plate_thresh = cv2.threshold(license_plate_gray, 64, 255, cv2.THRESH_BINARY_INV)

        output = reader.readtext(license_plate_thresh)

        for out in output:
            _, text, text_score = out
            if text_score > 0.4:
                results.append({
                    'text': text,
                    'score': float(text_score)
                })
            else:
                results.append({"can't detect"
                })

    return jsonify({'results': results}), 200

if __name__ == '__main__':
    app.run(debug=True)