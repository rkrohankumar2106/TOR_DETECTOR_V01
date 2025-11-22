from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid

try:
    from . import models, schemas, database, analyzer, intel
except ImportError:
    import models, schemas, database, analyzer, intel

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="TOR Analyzer Backend")

# CORS Middleware
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to TOR Analyzer Backend"}

@app.post("/api/upload-pcap")
def upload_pcap(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Save file temporarily
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Analyze file
    try:
        threat_count = analyzer.analyze_pcap(file_path, db)
        return {"filename": file.filename, "threat_count": threat_count, "status": "processed"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Cleanup uploaded file if needed
        # os.remove(file_path)
        pass

@app.get("/api/logs", response_model=List[schemas.ForensicLog])
def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(models.ForensicLog).offset(skip).limit(limit).all()
    return logs

@app.post("/api/refresh-intel")
def refresh_intel(db: Session = Depends(get_db)):
    try:
        from . import intel
    except ImportError:
        import intel
    count = intel.refresh_tor_nodes(db)
    return {"message": f"Refreshed Tor nodes. Total count: {count}"}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_incidents = db.query(models.ForensicLog).count()
    active_nodes = db.query(models.TorNode).count()
    return {
        "total_incidents": total_incidents,
        "active_tor_nodes": active_nodes
    }
