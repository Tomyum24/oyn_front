import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiFetch } from "../../lib/api";
import "./UserPage.css";
import Sidebar from "./ui/sidebar";
import TeacherDashboard from "./ui/TeacherDashboard";

function UserProfile() {
    const user = useSelector((state) => state.user.user);
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [activeTab, setActiveTab] = useState("courses");

    useEffect(() => {
        apiFetch(`/api/auth/me`).then(setProfile).catch(() => {});

        if (user?.email) {
            apiFetch(`/api/enrollments?email=${encodeURIComponent(user.email)}`)
                .then(setEnrollments)
                .catch(() => {});
        }
    }, [id, user?.email]);

    if (!profile) return <p>Loading...</p>;

    const isTeacher = user?.role === "professor";

    return (
        <div className="dashboard">
            <Sidebar profile={profile} activeTab={activeTab} setActiveTab={setActiveTab} isTeacher={isTeacher} />

            <div className="content">
                {isTeacher && activeTab === "courses" ? (
                    <TeacherDashboard />
                ) : (
                    <>
                        <div className="courses-grid">
                            {enrollments.length === 0 && (
                                <p>You have no enrolled courses yet.</p>
                            )}
                            {enrollments.map((enrollment) => (
                                <div key={enrollment.enrollmentId} className="course-card">
                                    <div className="course-info">
                                        <h3>{enrollment.courseTitle}</h3>
                                        <p className="author">{enrollment.courseSlug}</p>
                                        <span className={`tag status-${enrollment.status?.toLowerCase()}`}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
