import { useState } from "react";
import TeacherMyCourses from "./TeacherMyCourses";
import TeacherUploadVideo from "./TeacherUploadVideo";
import TeacherCreateAssessment from "./TeacherCreateAssessment";

const TABS = [
    { id: "courses", label: "My Courses", icon: "📚" },
    { id: "upload", label: "Upload Video", icon: "🎬" },
    { id: "assessment", label: "Create Assessment", icon: "📋" },
];

function TeacherDashboard() {
    const [tab, setTab] = useState("courses");

    return (
        <div className="lms-root">
            <div className="lms-header">
                <div className="lms-header-title">
                    <span className="lms-header-icon">📖</span>
                    <span>Learning Management System</span>
                </div>
            </div>

            <div className="lms-tabs">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        className={`lms-tab ${tab === t.id ? "active" : ""}`}
                        onClick={() => setTab(t.id)}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            <div className="lms-content">
                {tab === "courses" && <TeacherMyCourses />}
                {tab === "upload" && <TeacherUploadVideo />}
                {tab === "assessment" && <TeacherCreateAssessment />}
            </div>
        </div>
    );
}

export default TeacherDashboard;
