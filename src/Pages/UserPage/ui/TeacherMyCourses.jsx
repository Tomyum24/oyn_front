import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import { toast } from "react-toastify";

const LEVEL_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LOCALE_OPTIONS = [
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
    { value: "kz", label: "Қазақша" },
];

const EMPTY_FORM = {
    title: "",
    subtitle: "",
    description: "",
    locale: "ru",
    level: "BEGINNER",
    durationHours: 1,
    price: "",
};

function CourseForm({ initial, onSubmit, onClose, loading, submitLabel }) {
    const [form, setForm] = useState(initial || EMPTY_FORM);

    function set(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            ...form,
            price: form.price !== "" && form.price != null ? Number(form.price) : null,
        };
        await onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="lms-form">
            <div className="lms-field-row">
                <div className="lms-field" style={{ flex: 2 }}>
                    <label>Title *</label>
                    <input
                        value={form.title}
                        onChange={e => set("title", e.target.value)}
                        placeholder="e.g., Introduction to React"
                        maxLength={180}
                        required
                    />
                </div>
                <div className="lms-field" style={{ flex: 1 }}>
                    <label>Duration (hours) *</label>
                    <input
                        type="number" min="1" max="1000"
                        value={form.durationHours}
                        onChange={e => set("durationHours", Number(e.target.value))}
                        required
                    />
                </div>
            </div>

            <div className="lms-field">
                <label>Subtitle</label>
                <input
                    value={form.subtitle}
                    onChange={e => set("subtitle", e.target.value)}
                    placeholder="Short tagline for the course"
                    maxLength={240}
                />
            </div>

            <div className="lms-field">
                <label>Description *</label>
                <textarea
                    value={form.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="What will students learn? What are the prerequisites?"
                    rows={5}
                    maxLength={2000}
                    required
                />
                <small style={{ color: "#9ca3af" }}>{form.description.length}/2000</small>
            </div>

            <div className="lms-field-row">
                <div className="lms-field">
                    <label>Level</label>
                    <select value={form.level} onChange={e => set("level", e.target.value)}>
                        {LEVEL_OPTIONS.map(l => (
                            <option key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</option>
                        ))}
                    </select>
                </div>
                <div className="lms-field">
                    <label>Language *</label>
                    <select value={form.locale} onChange={e => set("locale", e.target.value)}>
                        {LOCALE_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="lms-field">
                <label>Price (USD)</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Leave empty for free"
                    value={form.price}
                    onChange={e => set("price", e.target.value)}
                />
                <small>Leave empty if the course is free</small>
            </div>

            <div className="lms-form-actions">
                <button type="submit" className="lms-btn-primary" disabled={loading}>
                    {loading ? "Saving…" : submitLabel}
                </button>
                <button type="button" className="lms-btn-ghost" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}

function CourseModal({ title, initial, onClose, onSubmit }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(form) {
        setLoading(true);
        try {
            await onSubmit(form);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lms-modal-overlay">
            <div className="lms-modal" style={{ width: 580 }}>
                <h2>{title}</h2>
                <CourseForm
                    initial={initial}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    loading={loading}
                    submitLabel={title}
                />
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        DRAFT: { label: "Draft", cls: "lms-status-draft" },
        PENDING_REVIEW: { label: "Under Review", cls: "lms-status-pending_review" },
        PUBLISHED: { label: "Published", cls: "lms-status-published" },
        REJECTED: { label: "Rejected", cls: "lms-status-rejected" },
    };
    const s = map[status] || { label: status, cls: "" };
    return <span className={`lms-status ${s.cls}`}>{s.label}</span>;
}

function CourseRow({ course, onUpdated, onDeleted }) {
    const [expanded, setExpanded] = useState(false);
    const [lessons, setLessons] = useState(null);
    const [lessonTab, setLessonTab] = useState("videos");
    const [editing, setEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

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

    async function doAction(action, successMsg) {
        setActionLoading(action);
        try {
            const updated = await apiFetch(`/api/teacher/courses/${course.slug}/${action}`, { method: "POST" });
            toast.success(successMsg);
            onUpdated(updated);
        } catch (err) {
            toast.error(err.message || `Failed to ${action}`);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDelete() {
        if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
        setActionLoading("delete");
        try {
            await apiFetch(`/api/teacher/courses/${course.slug}`, { method: "DELETE" });
            toast.success("Course deleted");
            onDeleted(course.slug);
        } catch (err) {
            toast.error(err.message || "Failed to delete");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleEdit(form) {
        try {
            const updated = await apiFetch(`/api/teacher/courses/${course.slug}`, {
                method: "PUT",
                body: JSON.stringify(form),
            });
            toast.success("Course updated!");
            onUpdated(updated);
            setEditing(false);
        } catch (err) {
            toast.error(err.message || "Failed to update");
            throw err;
        }
    }

    const canEdit = course.status === "DRAFT" || course.status === "REJECTED";
    const canPublish = course.status === "DRAFT" || course.status === "REJECTED";
    const canDelete = course.status === "DRAFT";
    const canWithdraw = course.status === "PENDING_REVIEW";
    const isPublished = course.status === "PUBLISHED";

    const videoLessons = (lessons || []).filter(l => l.hasVideo || l.videoUrl);
    const assessmentLessons = (lessons || []).filter(l => {
        try { JSON.parse(l.content); return true; } catch { return false; }
    });

    return (
        <>
            <div className="lms-course-row">
                <div className="lms-course-header" onClick={toggle}>
                    <div className="lms-course-info">
                        <h3>{course.title}</h3>
                        <p>{course.subtitle || course.description?.slice(0, 90) + (course.description?.length > 90 ? "…" : "")}</p>
                        <div className="lms-course-tags">
                            {course.level && <span className="lms-tag">{course.level}</span>}
                            {course.locale && <span className="lms-tag">{course.locale.toUpperCase()}</span>}
                            {course.durationHours && <span className="lms-tag">{course.durationHours}h</span>}
                        </div>
                    </div>
                    <div className="lms-course-meta">
                        <span className="lms-badge">{course.lessonCount || 0} lessons</span>
                        <StatusBadge status={course.status} />
                        <span className="lms-chevron">{expanded ? "▲" : "▼"}</span>
                    </div>
                </div>

                {/* Rejection reason */}
                {course.status === "REJECTED" && course.rejectionReason && (
                    <div className="lms-rejection-reason">
                        <strong>Rejection reason:</strong> {course.rejectionReason}
                    </div>
                )}

                {/* Action buttons */}
                <div className="lms-course-actions">
                    {isPublished && (
                        <Link to={`/courses/${course.slug}`} className="lms-btn-success" target="_blank">
                            View in Catalog →
                        </Link>
                    )}
                    {canPublish && (
                        <button
                            className="lms-btn-success"
                            disabled={actionLoading === "publish" || course.lessonCount === 0}
                            onClick={() => doAction("publish", "Course published!")}
                            title={course.lessonCount === 0 ? "Add at least one lesson first" : ""}
                        >
                            {actionLoading === "publish" ? "Publishing…" : "Publish"}
                        </button>
                    )}
                    {canEdit && (
                        <button className="lms-btn-outline" onClick={() => setEditing(true)}>
                            Edit
                        </button>
                    )}
                    {canWithdraw && (
                        <button
                            className="lms-btn-outline"
                            disabled={actionLoading === "withdraw"}
                            onClick={() => doAction("withdraw", "Course withdrawn from review")}
                        >
                            Withdraw from Review
                        </button>
                    )}
                    {canDelete && (
                        <button
                            className="lms-btn-danger"
                            disabled={actionLoading === "delete"}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>

                {/* Lessons */}
                {expanded && (
                    <div className="lms-course-body">
                        <div className="lms-lesson-tabs">
                            <button className={lessonTab === "videos" ? "active" : ""} onClick={() => setLessonTab("videos")}>
                                Videos ({videoLessons.length})
                            </button>
                            <button className={lessonTab === "assessments" ? "active" : ""} onClick={() => setLessonTab("assessments")}>
                                Assessments ({assessmentLessons.length})
                            </button>
                        </div>

                        {lessons === null && <p className="lms-loading">Loading lessons…</p>}

                        {lessons !== null && lessonTab === "videos" && (
                            videoLessons.length === 0
                                ? <p className="lms-empty">No video lessons yet. Use "Upload Video" tab to add one.</p>
                                : videoLessons.map(l => (
                                    <div key={l.id} className="lms-lesson-item">
                                        <div>
                                            <strong>{l.title}</strong>
                                            {l.summary && <p className="lms-lesson-summary">{l.summary}</p>}
                                        </div>
                                        <div className="lms-lesson-meta">
                                            {l.durationMinutes != null && (
                                                <span>⏱ {String(Math.floor(l.durationMinutes / 60)).padStart(2, "0")}:{String(l.durationMinutes % 60).padStart(2, "0")}</span>
                                            )}
                                            {l.createdAt && <span>📅 {l.createdAt.slice(0, 10)}</span>}
                                        </div>
                                    </div>
                                ))
                        )}

                        {lessons !== null && lessonTab === "assessments" && (
                            assessmentLessons.length === 0
                                ? <p className="lms-empty">No assessments yet. Use "Create Assessment" tab to add one.</p>
                                : assessmentLessons.map(l => (
                                    <div key={l.id} className="lms-lesson-item">
                                        <strong>{l.title}</strong>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </div>

            {editing && (
                <CourseModal
                    title="Edit Course"
                    initial={{
                        title: course.title,
                        subtitle: course.subtitle || "",
                        description: course.description,
                        locale: course.locale || "ru",
                        level: course.level || "BEGINNER",
                        durationHours: course.durationHours || 1,
                        price: course.price != null ? String(course.price) : "",
                    }}
                    onClose={() => setEditing(false)}
                    onSubmit={handleEdit}
                />
            )}
        </>
    );
}

function TeacherMyCourses() {
    const [courses, setCourses] = useState([]);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        apiFetch("/api/teacher/courses").then(setCourses).catch(() => {});
    }, []);

    async function handleCreate(form) {
        try {
            const course = await apiFetch("/api/teacher/courses", {
                method: "POST",
                body: JSON.stringify(form),
            });
            toast.success("Course created!");
            setCourses(prev => [course, ...prev]);
            setShowCreate(false);
        } catch (err) {
            toast.error(err.message || "Failed to create course");
            throw err;
        }
    }

    function handleUpdated(updated) {
        setCourses(prev => prev.map(c => c.slug === updated.slug ? updated : c));
    }

    function handleDeleted(slug) {
        setCourses(prev => prev.filter(c => c.slug !== slug));
    }

    return (
        <div className="lms-panel">
            <div className="lms-panel-header">
                <div>
                    <h2>My Courses</h2>
                    <p className="lms-subtitle" style={{ marginBottom: 0 }}>
                        {courses.length} course{courses.length !== 1 ? "s" : ""}
                        {" · "}
                        {courses.filter(c => c.status === "PUBLISHED").length} published
                    </p>
                </div>
                <button className="lms-btn-primary" onClick={() => setShowCreate(true)}>+ New Course</button>
            </div>

            {courses.length === 0
                ? <p className="lms-empty">You haven't created any courses yet. Click "+ New Course" to start.</p>
                : courses.map(c => (
                    <CourseRow
                        key={c.id}
                        course={c}
                        onUpdated={handleUpdated}
                        onDeleted={handleDeleted}
                    />
                ))
            }

            {showCreate && (
                <CourseModal
                    title="Create Course"
                    onClose={() => setShowCreate(false)}
                    onSubmit={handleCreate}
                />
            )}
        </div>
    );
}

export default TeacherMyCourses;
