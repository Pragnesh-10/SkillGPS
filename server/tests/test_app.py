import sys, os
from fastapi.testclient import TestClient

# ensure repo server path is on sys.path so tests can import `app`
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

client = TestClient(app)

SAMPLE = {
    "interests": {"numbers": True, "building": True, "design": False, "explaining": False, "logic": True},
    "workStyle": {"environment": "Solo", "structure": "Structured", "roleType": "Desk Job"},
    "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
    "confidence": {"math": 7, "coding": 6, "communication": 5}
}

def test_predict_returns_200_and_predictions():
    # Calling the rule-based endpoint directly
    res = client.post('/predict', json=SAMPLE)
    
    assert res.status_code == 200
    body = res.json()
    
    assert 'predictions' in body
    assert isinstance(body['predictions'], list)
    # Rule-based logic should return top 3
    assert len(body['predictions']) == 3
    
    p = body['predictions'][0]
    assert 'career' in p and 'prob' in p
    # With the sample input (numbers, logic, building, coding confidence), 
    # Backend Developer or Data Scientist should likely be top.
    print(f"Top prediction: {p['career']} ({p['prob']})")
    assert p['career'] in ['Data Scientist', 'Backend Developer']


def test_predict_no_matches():
    # Test zero-division avoidance and edge cases
    empty_sample = {
        "interests": {},
        "workStyle": {},
        "intent": {},
        "confidence": {}
    }
    res = client.post('/predict', json=empty_sample)
    assert res.status_code == 200
    body = res.json()
    predictions = body['predictions']

    # Should just return top 3 with 0 prob
    assert len(predictions) == 3
    for p in predictions:
        assert p['prob'] == 0.0


def test_predict_frontend_developer():
    # Test specific path for Frontend Developer
    frontend_sample = {
        "interests": {"design": True, "building": True, "coding": True, "art": True},
        "workStyle": {"roleType": "Desk Job"},
        "intent": {"nature": "creative"},
        "confidence": {"coding": 7, "design": 6}
    }
    res = client.post('/predict', json=frontend_sample)
    assert res.status_code == 200
    predictions = res.json()['predictions']

    # Should be the #1 match
    assert predictions[0]['career'] == 'Frontend Developer'


def test_predict_confidence_threshold():
    # Only confidence >= 6 should boost
    sample_low_conf = {
        "interests": {},
        "workStyle": {},
        "intent": {},
        "confidence": {"math": 5} # shouldn't boost Data Scientist
    }
    res_low = client.post('/predict', json=sample_low_conf)
    preds_low = res_low.json()['predictions']

    # all probs should be 0 because 5 < 6
    for p in preds_low:
        assert p['prob'] == 0.0

    sample_high_conf = {
        "interests": {},
        "workStyle": {},
        "intent": {},
        "confidence": {"math": 6} # should boost Data Scientist
    }
    res_high = client.post('/predict', json=sample_high_conf)
    preds_high = res_high.json()['predictions']

    # math is a keyword for Data Scientist
    assert preds_high[0]['career'] == 'Data Scientist'
    assert preds_high[0]['prob'] > 0.0


def test_predict_bonus_scoring():
    # Test bonus scoring (nature and roleType)
    sample_bonus_only = {
        "interests": {},
        "workStyle": {"roleType": "Meetings"},
        "intent": {"nature": "management"},
        "confidence": {}
    }
    res = client.post('/predict', json=sample_bonus_only)
    predictions = res.json()['predictions']

    # Product Manager has bonus nature: management, roleType: Meetings
    assert predictions[0]['career'] == 'Product Manager'
    assert predictions[0]['prob'] > 0.0
