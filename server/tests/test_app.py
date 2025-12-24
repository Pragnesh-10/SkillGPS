import sys, os
from unittest.mock import patch, MagicMock
import joblib
# ensure repo server path is on sys.path so tests can import `app`
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

SAMPLE = {
    "interests": {"numbers": True, "building": True, "design": False, "explaining": False, "logic": True},
    "workStyle": {"environment": "Solo", "structure": "Structured", "roleType": "Desk Job"},
    "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
    "confidence": {"math": 7, "coding": 6, "communication": 5}
}


def test_predict_returns_200_and_predictions():
    # Mock model pipeline
    mock_pipeline = MagicMock()
    # Mock classes_ attribute
    mock_pipeline.classes_ = ['Data Scientist', 'Backend Developer', 'UI/UX Designer']
    # Mock predict_proba to return dummy probabilities
    # 3 classes, so return 3 probabilities
    mock_pipeline.predict_proba.return_value = [[0.8, 0.15, 0.05]]

    # Mock joblib.load to return a dict containing the mock pipeline
    with patch('joblib.load', return_value={'model_pipeline': mock_pipeline}):
        with TestClient(app) as client:
            res = client.post('/predict', json=SAMPLE)
            assert res.status_code == 200
            body = res.json()
            assert 'predictions' in body
            assert isinstance(body['predictions'], list)
            assert len(body['predictions']) >= 1
            # Each prediction should have career & prob
            p = body['predictions'][0]
            assert 'career' in p and 'prob' in p
            assert p['career'] == 'Data Scientist'
            assert p['prob'] == 0.8
