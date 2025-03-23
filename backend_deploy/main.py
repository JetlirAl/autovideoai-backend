from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from whisper_processor import transcribe_audio
from cutter import cut_video
import shutil
import uuid
import os

app = FastAPI()

UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    video_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp4")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        cut_path = cut_video(file_path, video_id)
        subtitles = transcribe_audio(file_path)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

    return {
        "video_id": video_id,
        "original_video": file_path,
        "cut_video": cut_path,
        "subtitles": subtitles
    }
