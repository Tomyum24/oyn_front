import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { toast } from "react-toastify";
import { apiFetch } from "../../lib/api";

function CourseLandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [email, setEmail] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    apiFetch(`/api/courses/${slug}`)
      .then(data => setCourse(data))
      .catch(err => {
        if (err.status === 404) toast.error("Course not found");
      });
  }, [slug]);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    setIsEnrolling(true);

    try {
      await apiFetch(`/api/enrollments`, {
        method: "POST",
        body: JSON.stringify({
          email,
          courseId: course.id
        })
      });

      toast.success("You are enrolled 🎉");

      if (course.lessons?.length > 0) {
        navigate(`/courses/${slug}/lessons/${course.lessons[0].slug}`);
      }
    } catch (error) {
      if (error.status === 409) {
        toast.info("Already enrolled");
      } else {
        toast.error("Enrollment failed");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!course) {
    return (
      <>
        <Header />
        <p style={{ padding: 40 }}>Loading...</p>
        <Footer />
      </>
    );
  }

  return (
<>
  <Header />

  {/* HERO */}
  <div className="hero-section">
    <div className="hero-content">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span className="active">Course</span>
      </div>

      <h1 className="hero-title">Course Details</h1>
    </div>

    <div className="hero-image">
      <img src={course.imageUrl} alt={course.title} />
    </div>
  </div>

  {/* TABS */}
  <div className="tabs-container">
    <button
      className={`tab ${activeTab === "overview" ? "active" : ""}`}
      onClick={() => setActiveTab("overview")}
    >
      Overview
    </button>

    <button
      className={`tab ${activeTab === "curriculum" ? "active" : ""}`}
      onClick={() => setActiveTab("curriculum")}
    >
      Curriculum
    </button>
  </div>

  {/* MAIN */}
  <div className="course-container">

    {/* LEFT */}
    <div className="course-main">

      <img
        src={course.imageUrl}
        alt={course.title}
        className="course-image"
      />

      <div className="course-info">
        <h2 className="course-title">{course.title}</h2>

        <div className="course-meta">
          <span>🕒 {course.durationHours} hours</span>
          <span>📊 {course.level}</span>
          <span>🌐 {course.locale}</span>
        </div>
      </div>

      <div className="tab-content">

        {activeTab === "overview" && (
          <>
            <h3>Course Description</h3>
            <p>{course.description}</p>

            <h3>What you will learn</h3>
            <ul>
              {course.learningOutcomes?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {activeTab === "curriculum" && (
          <ul className="lesson-list">
            {course.lessons?.map((lesson) => (
              <li key={lesson.id}>
                <strong>Lesson {lesson.position}:</strong>{" "}
                <Link to={`/courses/${slug}/lessons/${lesson.slug}`}>
                  {lesson.title}
                </Link>
                <span> ({lesson.durationMinutes} min)</span>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>

    {/* RIGHT SIDEBAR */}
    <div className="course-sidebar">

      <img
        src={course.imageUrl}
        alt="preview"
        className="sidebar-image"
      />

      <div className="course-price">
        Free Course
      </div>

      <form onSubmit={handleEnrollment} className="enroll-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={isEnrolling}>
          {isEnrolling ? "Enrolling..." : "Enroll Now"}
        </button>
      </form>

      <div className="course-details">
        <p><strong>Lessons:</strong> {course.lessons?.length || 0}</p>
        <p><strong>Level:</strong> {course.level}</p>
        <p><strong>Language:</strong> {course.locale}</p>
      </div>

    </div>
  </div>

  <Footer />
</>
  );
}

export default CourseLandingPage;