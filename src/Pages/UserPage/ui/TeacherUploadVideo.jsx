import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { toast } from "react-toastify";

function TeacherUploadVideo() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ courseSlug: "", title: "", summary: "", duration: "", content: "Video lesson" });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        apiFetch("/api/teacher/courses").then(setCourses).catch(() => {});
    }, []);

    function parseDuration(str) {
        const parts = str.split(":").map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.courseSlug) { toast.error("Select a course"); return; }
        if (!form.title.trim()) { toast.error("Enter video title"); return; }
        const durationMinutes = parseDuration(form.duration);
        if (!durationMinutes) { toast.error("Enter valid duration (MM:SS or HH:MM:SS)"); return; }

        setLoading(true);
        try {
            // 1. Create lesson
            const lesson = await apiFetch(`/api/teacher/courses/${form.courseSlug}/lessons`, {
                method: "POST",
                body: JSON.stringify({
                    title: form.title.trim(),
                    summary: form.summary.trim(),
                    content: form.content || form.title.trim(),
                    durationMinutes,
                }),
            });

            // 2. If file selected — initiate upload
            if (file) {
                const initResp = await apiFetch(
                    `/api/teacher/courses/${form.courseSlug}/lessons/${lesson.slug}/video-upload`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            fileName: file.name,
                            contentType: file.type || "video/mp4",
                            sizeBytes: file.size,
                        }),
                    }
                );

                // 3. Upload to provided URL (skip for in-memory local dev)
                const isInMemory = initResp.uploadUrl?.startsWith("inmemory://");
                if (!isInMemory) {
                    const headers = initResp.requiredHeaders || {};
                    await fetch(initResp.uploadUrl, {
                        method: "PUT",
                        headers: { "Content-Type": file.type || "video/mp4", ...headers },
                        body: file,
                    });
                }

                // 4. Complete upload
                await apiFetch(
                    `/api/teacher/courses/${form.courseSlug}/lessons/${lesson.slug}/video-upload/complete`,
                    {
                        method: "POST",
                        body: JSON.stringify({ objectKey: initResp.objectKey }),
                    }
                );
            }

            toast.success("Video lesson uploaded!");
            setForm(f => ({ ...f, title: "", summary: "", duration: "", content: "Video lesson" }));
            setFile(null);
            if (fileRef.current) fileRef.current.value = "";
        } catch (err) {
            toast.error(err.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lms-panel">
            <h2>Upload Video Lesson</h2>
            <p className="lms-subtitle">Add a new video lesson to your course</p>

            <form onSubmit={handleSubmit} className="lms-form">
                <div className="lms-field">
                    <label>Course *</label>
                    <select value={form.courseSlug} onChange={e => setForm(f => ({ ...f, courseSlug: e.target.value }))} required>
                        <option value="">Select a course</option>
                        {courses.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
                    </select>
                </div>

                <div className="lms-field">
                    <label>Video Title *</label>
                    <input
                        placeholder="e.g., Introduction to React Hooks"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        required
                    />
                </div>

                <div className="lms-field">
                    <label>Description *</label>
                    <textarea
                        placeholder="Provide a brief description of what students will learn"
                        value={form.summary}
                        onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                        rows={4}
                        required
                    />
                </div>

                <div className="lms-field">
                    <label>Duration *</label>
                    <input
                        placeholder="e.g., 15:30"
                        value={form.duration}
                        onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                        required
                    />
                    <small>Format: MM:SS or HH:MM:SS</small>
                </div>

                <div className="lms-field">
                    <label>Video File</label>
                    <div
                        className="lms-dropzone"
                        onClick={() => fileRef.current?.click()}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept="video/mp4,video/mov,video/avi"
                            style={{ display: "none" }}
                            onChange={e => setFile(e.target.files[0] || null)}
                        />
                        {file ? (
                            <p className="lms-file-selected">{file.name}</p>
                        ) : (
                            <>
                                <div className="lms-upload-icon">↑</div>
                                <p>Click to upload video</p>
                                <small>MP4, MOV, or AVI (max 500MB)</small>
                            </>
                        )}
                    </div>
                </div>

                <div className="lms-form-actions">
                    <button type="submit" className="lms-btn-primary" disabled={loading}>
                        {loading ? "Uploading…" : "Upload Video"}
                    </button>
                    <button type="button" className="lms-btn-ghost"
                        onClick={() => { setForm(f => ({ ...f, title: "", summary: "", duration: "" })); setFile(null); }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TeacherUploadVideo;
