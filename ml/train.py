"""
Train a baseline classifier from the bootstrap JSONL dataset and save model + preprocessor.
Usage:
  python train.py --input ml/data/bootstrap.jsonl --out ml/models/rf_baseline.joblib

Produces a joblib file with keys: 'model' and 'preprocessor' (ColumnTransformer + label encoder)
"""

import argparse
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, top_k_accuracy_score
import joblib
import os


def load_jsonl(path):
    rows = []
    with open(path, 'r') as f:
        for line in f:
            rows.append(json.loads(line))
    return rows


def prepare_df(rows):
    # Flatten structure
    recs = []
    for r in rows:
        row = {}
        # interests
        for k, v in r.get('interests', {}).items():
            row[f'int_{k}'] = int(bool(v))
        # confidences
        for k, v in r.get('confidence', {}).items():
            row[f'conf_{k}'] = int(v)
        # workStyle
        for k, v in r.get('workStyle', {}).items():
            row[f'ws_{k}'] = v
        # intent
        for k, v in r.get('intent', {}).items():
            row[f'intent_{k}'] = v
        row['label'] = r.get('label')
        recs.append(row)
    return pd.DataFrame(recs)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default='ml/data/bootstrap.jsonl')
    parser.add_argument('--out', default='ml/models/rf_baseline.joblib')
    parser.add_argument('--test-size', type=float, default=0.2)
    args = parser.parse_args()

    rows = load_jsonl(args.input)
    df = prepare_df(rows)

    X = df.drop(columns=['label'])
    y = df['label']

    # Categorical columns to one-hot
    categorical_cols = [c for c in X.columns if c.startswith('ws_') or c.startswith('intent_')]
    numeric_cols = [c for c in X.columns if c.startswith('conf_') or c.startswith('int_')]

    preprocessor = ColumnTransformer([
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
    ], remainder='passthrough')

    clf = Pipeline([
        ('pre', preprocessor),
        ('rf', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=args.test_size, random_state=42, stratify=y)

    print('Training on', len(X_train), 'samples')
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)

    # top-3 accuracy using predict_proba
    try:
        probs = clf.predict_proba(X_test)
        top3 = top_k_accuracy_score(y_test, probs, k=3, labels=clf.classes_)
    except Exception:
        top3 = None

    print(f'Accuracy: {acc:.4f}')
    if top3 is not None:
        print(f'Top-3 accuracy: {top3:.4f}')

    # save (ensure directory exists)
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    joblib.dump({'model_pipeline': clf}, args.out)
    print('Saved model to', args.out)


if __name__ == '__main__':
    main()
