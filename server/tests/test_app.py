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

from unittest.mock import patch, mock_open

from app import VISITOR_FILE

def test_visitor_count_no_file():
    with patch('os.path.exists', return_value=False):
        with patch('builtins.open', mock_open()) as mocked_file:
            res = client.get('/visitor-count')
            assert res.status_code == 200
            assert res.json() == {'count': 1}
            mocked_file.assert_called_once_with(VISITOR_FILE, 'w')
            mocked_file().write.assert_called_once_with('1')

def test_visitor_count_read_exception():
    with patch('os.path.exists', return_value=True):
        # First call (read) raises Exception, second call (write) succeeds
        with patch('builtins.open', side_effect=[Exception("Read Error"), mock_open().return_value]):
            res = client.get('/visitor-count')
            assert res.status_code == 200
            assert res.json() == {'count': 1} # Should fallback to 0, then increment to 1

def test_visitor_count_write_oserror():
    with patch('os.path.exists', return_value=False):
        # With return_value=False for os.path.exists, open is only called once (for writing)
        with patch('builtins.open', side_effect=OSError("Write Error")):
            res = client.get('/visitor-count')
            assert res.status_code == 200
            assert res.json() == {'count': 1}

def test_visitor_count_write_permissionerror():
    with patch('os.path.exists', return_value=False):
        with patch('builtins.open', side_effect=PermissionError("Permission Denied")):
            res = client.get('/visitor-count')
            assert res.status_code == 200
            assert res.json() == {'count': 1}

def test_visitor_count_write_general_exception():
    with patch('os.path.exists', return_value=False):
        # The app.py also has `except Exception:` after `except (OSError, PermissionError):`
        # so it should catch general exceptions during write as well.
        with patch('builtins.open', side_effect=Exception("General Error")):
            res = client.get('/visitor-count')
            assert res.status_code == 200
            assert res.json() == {'count': 1}

def test_visitor_count_existing_file():
    with patch('os.path.exists', return_value=True):
        # We need mock_open to first return a read file, then a write file.
        m = mock_open(read_data='5')
        with patch('builtins.open', m):
            res = client.get('/visitor-count')
            assert res.status_code == 200
            assert res.json() == {'count': 6}
