import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { toast } from "react-toastify";

function NewCourseModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ title: "", description: "", locale: "ru", level: "BEGINNER", durationHours: 1 });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const course = await apiFetch("/api/teacher/courses", {
                method: "POST",
                body: JSON.stringify(form),
            });
            toast.success("Course created!");
            onCreated(course);
        } catch (err) {
            toast.error(err.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lms-modal-overlay">
            <div className="lms-modal">
                <h2>New Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="lms-field">
                        <label>Title *</label>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                    </div>
                    <div className="lms-field">
                        <label>Description *</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3} />
                    </div>
                    <div className="lms-field-row">
                        <div className="lms-field">
                            <label>Level</label>
                            <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>
                        <div className="lms-field">
                            <label>Duration (hours) *</label>
                            <input type="number" min="1" max="1000" value={form.durationHours}
                                onChange={e => setForm(f => ({ ...f, durationHours: Number(e.target.value) }))} required />
                        </div>
                    </div>
                    <div className="lms-modal-actions">
                        <button type="submit" className="lms-btn-primary" disabled={loading}>
                            {loading ? "Creating…" : "Create Course"}
                        </button>
                        <button type="button" className="lms-btn-ghost" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CourseRow({ course }) {
    const [expanded, setExpanded] = useState(false);
    const [lessons, setLessons] = useState(null);
    const [lessonTab, setLessonTab] = useState("videos");

    async function loadLessons() {
        if (lessons !== null) return;
        try {
            const data = await apiFetch(`/api/teacher/courses/${course.slug}/lessons`);
            setLessons(data);
        } catch {
            setLessons([]);
        }
    }

    function toggle() {
        if (!expanded) loadLessons();
        setExpanded(v => !v);
    }

    const videoLessons = (lessons || []).filter(l => l.hasVideo || l.videoUrl);
    const assessmentLessons = (lessons || []).filter(l => {
        try { JSON.parse(l.content); return true; } catch { return false; }
    });

    return (
        <div className="lms-course-row">
            <div className="lms-course-header" onClick={toggle}>
                <div className="lms-course-info">
                    <h3>{course.title}</h3>
                    <p>{course.subtitle || course.description?.slice(0, 80)}</p>
                </div>
                <div className="lms-course-meta">
                    <span className="lms-badge">{course.lessonCount || 0} videos</span>
                    <span className={`lms-status lms-status-${course.status?.toLowerCase()}`}>{course.status}</span>
                    <span className="lms-chevron">{expanded ? "▲" : "▼"}</span>
                </div>
            </div>

            {expanded && (
                <div className="lms-course-body">
                    <div className="lms-lesson-tabs">
                        <button className={lessonTab === "videos" ? "active" : ""} onClick={() => setLessonTab("videos")}>
                            Videos
                        </button>
                        <button className={lessonTab === "assessments" ? "active" : ""} onClick={() => setLessonTab("assessments")}>
                            Assessments
                        </button>
                    </div>

                    {lessons === null && <p className="lms-loading">Loading…</p>}

                    {lessons !== null && lessonTab === "videos" && (
                        videoLessons.length === 0
                            ? <p className="lms-empty">No video lessons yet.</p>
                            : videoLessons.map(l => (
                                <div key={l.id} className="lms-lesson-item">
                                    <div>
                                        <strong>{l.title}</strong>
                                        <p className="lms-lesson-summary">{l.summary}</p>
                                    </div>
                                    <div className="lms-lesson-meta">
                                        {l.durationMinutes && <span>⏱ {Math.floor(l.durationMinutes / 60).toString().padStart(2, "0")}:{(l.durationMinutes % 60).toString().padStart(2, "0")}</span>}
                                        {l.createdAt && <span>📅 {l.createdAt.slice(0, 10)}</span>}
                                    </div>
                                </div>
                            ))
                    )}

                    {lessons !== null && lessonTab === "assessments" && (
                        assessmentLessons.length === 0
                            ? <p className="lms-empty">No assessments yet.</p>
                            : assessmentLessons.map(l => (
                                <div key={l.id} className="lms-lesson-item">
                                    <strong>{l.title}</strong>
                                </div>
                            ))
                    )}
                </div>
            )}
        </div>
    );
}

function TeacherMyCourses({ onNewCourse }) {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        apiFetch("/api/teacher/courses").then(setCourses).catch(() => {});
    }, []);

    function handleCreated(course) {
        setCourses(prev => [course, ...prev]);
        setShowModal(false);
        if (onNewCourse) onNewCourse(course);
    }

    return (
        <div className="lms-panel">
            <div className="lms-panel-header">
                <h2>My Courses</h2>
                <button className="lms-btn-primary" onClick={() => setShowModal(true)}>+ New Course</button>
            </div>

            {courses.length === 0
                ? <p className="lms-empty">You haven't created any courses yet.</p>
                : courses.map(c => <CourseRow key={c.id} course={c} />)
            }

            {showModal && <NewCourseModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
        </div>
    );
}

export default TeacherMyCourses;
