import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { toast } from "react-toastify";

function getVideoPreviewUrl(url) {
    if (!url) return null;
    // YouTube: youtube.com/watch?v=ID or youtu.be/ID
    const ytMatch = url.match(
        /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
}

function VideoPreview({ url }) {
    const embedUrl = getVideoPreviewUrl(url);
    if (!embedUrl) return null;
    return (
        <div className="lms-video-preview">
            <iframe
                src={embedUrl}
                title="Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

function parseDuration(str) {
    const parts = str.trim().split(":").map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
}

function TeacherUploadVideo() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        courseSlug: "",
        title: "",
        summary: "",
        duration: "",
        videoUrl: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiFetch("/api/teacher/courses").then(setCourses).catch(() => {});
    }, []);

    function set(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.courseSlug) { toast.error("Select a course"); return; }
        if (!form.videoUrl.trim()) { toast.error("Enter a video URL"); return; }

        const durationMinutes = parseDuration(form.duration);
        if (!durationMinutes) { toast.error("Enter valid duration (MM:SS or HH:MM:SS)"); return; }

        setLoading(true);
        try {
            await apiFetch(`/api/teacher/courses/${form.courseSlug}/lessons`, {
                method: "POST",
                body: JSON.stringify({
                    title: form.title.trim(),
                    summary: form.summary.trim(),
                    content: form.summary.trim() || form.title.trim(),
                    videoUrl: form.videoUrl.trim(),
                    durationMinutes,
                }),
            });
            toast.success("Video lesson added!");
            setForm({ courseSlug: form.courseSlug, title: "", summary: "", duration: "", videoUrl: "" });
        } catch (err) {
            toast.error(err.message || "Failed to add lesson");
        } finally {
            setLoading(false);
        }
    }

    const previewEmbed = getVideoPreviewUrl(form.videoUrl);

    return (
        <div className="lms-panel">
            <h2>Add Video Lesson</h2>
            <p className="lms-subtitle">Add a video lesson using a YouTube or Vimeo link</p>

            <form onSubmit={handleSubmit} className="lms-form">
                <div className="lms-field">
                    <label>Course *</label>
                    <select value={form.courseSlug} onChange={e => set("courseSlug", e.target.value)} required>
                        <option value="">Select a course</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.slug}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <div className="lms-field">
                    <label>Video Title *</label>
                    <input
                        placeholder="e.g., Introduction to React Hooks"
                        value={form.title}
                        onChange={e => set("title", e.target.value)}
                        required
                    />
                </div>

                <div className="lms-field">
                    <label>Video URL *</label>
                    <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={form.videoUrl}
                        onChange={e => set("videoUrl", e.target.value)}
                        required
                    />
                    <small>Supports YouTube, Vimeo, or any direct video link</small>
                </div>

                {form.videoUrl && !previewEmbed && (
                    <p className="lms-url-note">Direct link — will play in browser</p>
                )}

                {previewEmbed && <VideoPreview url={form.videoUrl} />}

                <div className="lms-field">
                    <label>Description</label>
                    <textarea
                        placeholder="Briefly describe what students will learn"
                        value={form.summary}
                        onChange={e => set("summary", e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="lms-field">
                    <label>Duration *</label>
                    <input
                        placeholder="e.g., 15:30"
                        value={form.duration}
                        onChange={e => set("duration", e.target.value)}
                        required
                    />
                    <small>Format: MM:SS or HH:MM:SS</small>
                </div>

                <div className="lms-form-actions">
                    <button type="submit" className="lms-btn-primary" disabled={loading}>
                        {loading ? "Saving…" : "Add Lesson"}
                    </button>
                    <button
                        type="button"
                        className="lms-btn-ghost"
                        onClick={() => setForm(f => ({ ...f, title: "", summary: "", duration: "", videoUrl: "" }))}
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TeacherUploadVideo;
