# ML Bootstrap and Training

This folder contains scripts to bootstrap a labeled dataset using the existing rule-based engine and train a baseline classifier.

Quick steps:

1. Generate a dataset (default 50k samples):

   ```bash
   cd ml
   node generate_bootstrap.js
   # or to generate fewer/more samples
   SAMPLE_SIZE=20000 node generate_bootstrap.js
   ```

2. Create a virtualenv and install requirements:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. Train a baseline RandomForest:

   ```bash
   python train.py --input ml/data/bootstrap.jsonl --out ml/models/rf_baseline.joblib
   ```

The generated model file (`rf_baseline.joblib`) contains a dictionary with `model_pipeline` key that can be loaded with `joblib.load()`.
