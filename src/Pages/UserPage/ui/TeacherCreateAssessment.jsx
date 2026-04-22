import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { toast } from "react-toastify";

const emptyQuestion = () => ({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
});

function TeacherCreateAssessment() {
    const [courses, setCourses] = useState([]);
    const [courseSlug, setCourseSlug] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiFetch("/api/teacher/courses").then(setCourses).catch(() => {});
    }, []);

    function addQuestion() {
        setQuestions(q => [...q, emptyQuestion()]);
    }

    function updateQuestion(idx, field, value) {
        setQuestions(q => q.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    }

    function updateOption(qIdx, oIdx, value) {
        setQuestions(q => q.map((item, i) => {
            if (i !== qIdx) return item;
            const options = [...item.options];
            options[oIdx] = value;
            return { ...item, options };
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!courseSlug) { toast.error("Select a course"); return; }
        if (!title.trim()) { toast.error("Enter assessment title"); return; }

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].text.trim()) { toast.error(`Question ${i + 1} text is required`); return; }
            if (questions[i].options.some(o => !o.trim())) { toast.error(`All options in question ${i + 1} are required`); return; }
        }

        const assessmentContent = JSON.stringify({
            type: "assessment",
            description,
            questions: questions.map(q => ({
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
            })),
        });

        setLoading(true);
        try {
            await apiFetch(`/api/teacher/courses/${courseSlug}/lessons`, {
                method: "POST",
                body: JSON.stringify({
                    title: title.trim(),
                    summary: description.trim() || title.trim(),
                    content: assessmentContent,
                    durationMinutes: 30,
                }),
            });
            toast.success("Assessment created!");
            setTitle(""); setDescription(""); setQuestions([emptyQuestion()]); setCourseSlug("");
        } catch (err) {
            toast.error(err.message || "Failed to create assessment");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lms-panel">
            <h2>Create Assessment</h2>
            <p className="lms-subtitle">Create a multiple-choice assessment for your course</p>

            <form onSubmit={handleSubmit} className="lms-form">
                <div className="lms-field">
                    <label>Course *</label>
                    <select value={courseSlug} onChange={e => setCourseSlug(e.target.value)} required>
                        <option value="">Select a course</option>
                        {courses.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
                    </select>
                </div>

                <div className="lms-field">
                    <label>Assessment Title *</label>
                    <input
                        placeholder="e.g., Week 1 Quiz - Introduction to Programming"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="lms-field">
                    <label>Description *</label>
                    <textarea
                        placeholder="Describe what this assessment covers"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        required
                    />
                </div>

                <div className="lms-questions-header">
                    <label>Questions *</label>
                    <button type="button" className="lms-btn-outline" onClick={addQuestion}>+ Add Question</button>
                </div>

                {questions.map((q, qIdx) => (
                    <div key={qIdx} className="lms-question-card">
                        <p className="lms-question-label">Question {qIdx + 1}</p>

                        <div className="lms-field">
                            <label>Question Text *</label>
                            <input
                                placeholder="Enter your question"
                                value={q.text}
                                onChange={e => updateQuestion(qIdx, "text", e.target.value)}
                                required
                            />
                        </div>

                        <label>Answer Options *</label>
                        {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="lms-option-row">
                                <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={q.correctIndex === oIdx}
                                    onChange={() => updateQuestion(qIdx, "correctIndex", oIdx)}
                                />
                                <input
                                    className="lms-option-input"
                                    placeholder={`Option ${oIdx + 1}`}
                                    value={opt}
                                    onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                    required
                                />
                                <span className={q.correctIndex === oIdx ? "lms-correct" : "lms-incorrect"}>
                                    {q.correctIndex === oIdx ? "✓ Correct" : "Incorrect"}
                                </span>
                            </div>
                        ))}
                        <small>Select the radio button next to the correct answer</small>
                    </div>
                ))}

                <div className="lms-form-actions">
                    <button type="submit" className="lms-btn-primary" disabled={loading}>
                        {loading ? "Saving…" : "Save Assessment"}
                    </button>
                    <button type="button" className="lms-btn-ghost"
                        onClick={() => { setTitle(""); setDescription(""); setQuestions([emptyQuestion()]); }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TeacherCreateAssessment;
