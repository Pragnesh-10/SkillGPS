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

def test_predict_interest_scoring():
    # Only interests match UX/UI Designer (design, art, psychology, communication)
    req = {
        "interests": {"design": True, "art": True, "psychology": True, "communication": True, "numbers": False},
        "workStyle": {},
        "intent": {},
        "confidence": {}
    }
    res = client.post('/predict', json=req)
    assert res.status_code == 200
    preds = res.json()['predictions']

    # UX/UI Designer should be the top career
    assert preds[0]['career'] == 'UX/UI Designer'

    # It matched 4 keywords (+4.0).
    # Other profiles:
    # Frontend Developer: design, art (+2.0)
    # Product Manager: communication (+1.0)
    # Total score = 4.0 + 2.0 + 1.0 = 7.0
    # Expected prob for UX/UI Designer = 4.0 / 7.0 = 0.57
    assert preds[0]['prob'] == 0.57

def test_predict_confidence_scoring():
    # Only confidence matches UX/UI Designer, with levels >= 6
    req = {
        "interests": {},
        "workStyle": {},
        "intent": {},
        "confidence": {"design": 6, "art": 7, "psychology": 10}
    }
    res = client.post('/predict', json=req)
    assert res.status_code == 200
    preds = res.json()['predictions']

    assert preds[0]['career'] == 'UX/UI Designer'

    # Matches 3 skills with level >= 6. Each adds 0.5 to UX/UI Designer. (+1.5)
    # Frontend Developer matches 'design', 'art' (+1.0)
    # Total score = 1.5 + 1.0 = 2.5
    # Prob for UX/UI Designer = 1.5 / 2.5 = 0.6
    assert preds[0]['prob'] == 0.6

def test_predict_confidence_low_no_boost():
    # Only confidence matches UX/UI Designer, but levels < 6
    req = {
        "interests": {},
        "workStyle": {},
        "intent": {},
        "confidence": {"design": 5, "art": 4, "psychology": 1}
    }
    res = client.post('/predict', json=req)
    assert res.status_code == 200
    preds = res.json()['predictions']

    # Since all confidence levels are < 6, total score across all careers will be 0.
    # Therefore, probabilities should all be 0.0
    for p in preds:
        assert p['prob'] == 0.0

def test_predict_bonus_scoring():
    # Only workStyle and intent matches Data Scientist
    # Data Scientist bonus: {"nature": "research", "roleType": "Desk Job"}
    req = {
        "interests": {},
        "workStyle": {"roleType": "Desk Job"},
        "intent": {"nature": "research"},
        "confidence": {}
    }
    res = client.post('/predict', json=req)
    assert res.status_code == 200
    preds = res.json()['predictions']

    assert preds[0]['career'] == 'Data Scientist'

    # Matches Data Scientist perfectly (+1.0 for intent, +0.5 for workStyle = +1.5)
    # Other Desk Job roles:
    # Frontend Developer (+0.5), Backend Developer (+0.5), UX/UI Designer (+0.5)
    # Total score = 1.5 + 0.5 + 0.5 + 0.5 = 3.0
    # Prob for Data Scientist = 1.5 / 3.0 = 0.5
    assert preds[0]['prob'] == 0.5

def test_predict_zero_match_handling():
    # Empty inputs to ensure total_score = 0 handles correctly
    req = {
        "interests": {},
        "workStyle": {},
        "intent": {},
        "confidence": {}
    }
    res = client.post('/predict', json=req)
    assert res.status_code == 200
    preds = res.json()['predictions']

    # Logic fallback sets total_score to 1, and prob calculation to 0.0
    for p in preds:
        assert p['prob'] == 0.0
