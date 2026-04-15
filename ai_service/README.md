## UrbanEye AI Service

FastAPI service for civic complaint analysis.

### Run

```bash
cd ai_service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Endpoints

- `GET /health`
- `POST /analyze`

Example payload:

```json
{
  "title": "Streetlight outage",
  "description": "Two streetlights are not working near the school crossing.",
  "location": "Boring Road Crossing, Patna"
}
```
