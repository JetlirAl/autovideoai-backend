from moviepy.editor import VideoFileClip
import os

def cut_video(video_path, video_id):
    clip = VideoFileClip(video_path)
    short_clip = clip.subclip(0, min(clip.duration, 60))
    cut_path = os.path.join("processed", f"{video_id}_cut.mp4")
    short_clip.write_videofile(cut_path, codec="libx264")
    return cut_path
