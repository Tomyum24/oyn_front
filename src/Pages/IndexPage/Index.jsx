import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Feature from "./Feature";
import "./HomePage.css";


const features = [
  {
    id: 1,
    photo: "practical", 
    title: "Practical Courses",
    text: "Real-world skills in IT, business, and design.",
  },
  {
    id: 2,
    photo: "live",
    title: "Live Classes",
    text: "Interactive sessions with mentors in real time.",
  },
  {
    id: 3,
    photo: "recorded",
    title: "Recorded Lessons",
    text: "Study anytime at your own pace.",
  },
  {
    id: 4,
    photo: "career",
    title: "Career Growth",
    text: "Build skills for work and future opportunities.",
  },
];

const trendingTopics = [
  {
    id: 1,
    title: "Large Language Models",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Machine Learning",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "AI Agents",
    image:
      "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=800&q=80",
  },
];

function CoursesSlider() {
  const sliderRef = useRef(null);

  const courses = [
  {
    id: 1,
    title: "React for Beginners",
    author: "John Doe",
    rating: 4.8,
    price: "$49",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    author: "Andrew Ng",
    rating: 4.9,
    price: "$79",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "UI/UX Design Mastery",
    author: "Sarah Smith",
    rating: 4.7,
    price: "$59",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "JavaScript Advanced",
    author: "David Kim",
    rating: 4.6,
    price: "$69",
    image:
      "/img/IndexPage/js.jpg",
  },
];  

  const scroll = (dir) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Popular Courses</h2>
          <p>Explore top courses and start learning today</p>
        </div>

        <div className="slider-controls">
          <button onClick={() => scroll("left")} aria-label="Previous courses">
            ←
          </button>
          <button onClick={() => scroll("right")} aria-label="Next courses">
            →
          </button>
        </div>

        <div className="popular-courses-slider" ref={sliderRef}>
  {courses.map((course) => (
    <div className="popular-course-card" key={course.id}>
      <div className="popular-course-image">
        <img src={course.image} alt={course.title} />
      </div>

      <div className="popular-course-body">
        <h4 className="popular-course-title">{course.title}</h4>
        <p className="popular-course-author">{course.author}</p>

        <div className="popular-course-rating">
          <span className="popular-rating-value">{course.rating}</span>
          <span className="popular-stars">★</span>
          <span className="popular-reviews">(12,540)</span>
        </div>

        <div className="popular-course-price-row">
          <span className="popular-price">{course.price}</span>
          <span className="popular-old-price">$89</span>
        </div>

        <span className="popular-course-badge">Bestseller</span>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="homepage">
      <section className="hero hero-modern" id="home">
        <div className="container hero-content hero-modern-content">
          <div className="hero-left">
            <span className="badge badge-soft">Never Stop Learning</span>

            <h1 className="hero-title">
              Grow your skills
              <br />
              by online courses
              <br />
              in Kazakhstan
            </h1>

            <p className="hero-description">
              Our platform helps students and young professionals learn practical
              skills through modern online education. Explore courses, connect with
              mentors, and build your future from anywhere in Kazakhstan.
            </p>

            <div className="hero-search hero-search-modern">
              <input type="text" placeholder="Class/Course" />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-visual-card">
              <img
                src="/img/IndexPage/student.png"
                alt="Student learning online"
                className="hero-student-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>High-quality online education for modern skills</h2>
            <p>
              Our platform provides accessible and effective learning for people
              across Kazakhstan through practical courses and flexible study
              formats.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <Feature
                key={feature.id}
                photo={feature.photo}
                title={feature.title}
                text={feature.text}
              />
            ))}
          </div>
        </div>
      </section>

       <DiscoverSection />

     <section className="mentor-hero" id="mentors">
  <div className="container mentor-hero-content">
    <div className="mentor-hero-left">
      <span className="badge">Qualified Mentors</span>

      <h2>
        Learn from professionals
        <br />
        and experienced mentors
      </h2>

      <p>
        Get guidance from real experts, understand difficult topics faster,
        and apply your knowledge in practice with mentor support.
      </p>

      <ul className="mentor-hero-list">
        <li>Personal guidance and feedback</li>
        <li>Real industry experience</li>
        <li>Support in difficult topics</li>
        <li>Faster skill growth</li>
      </ul>

      <Link to="/mentors" className="btn btn-primary">
        Become a Mentor
      </Link>
    </div>
  </div>
</section>

<CoursesSlider />

      <section className="newsletter">
        <div className="container newsletter-box">
          <h2>Subscribe for updates and new courses</h2>
          <p>
            Get information about new programs, course launches, and learning
            opportunities.
          </p>

          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
}
function DiscoverSection() {
  return (
    <section className="discover-section">
      <div className="container">
        <div className="discover-top">
          <div className="discover-top-text">
            <h3>Effective learning for your future</h3>
            <p>
              Start your path in modern education. Discover practical courses,
              useful skills, and flexible formats for study.
            </p>
          </div>

          <div
  className="discover-top-banner"
  style={{
    backgroundImage: 'url("/img/IndexPage/discoverimg.jpg")',
  }}
></div>
        </div>

        <div className="discover-bottom">
          <div className="discover-intro">
            <h2>Explore important skills for career and life</h2>
            <p>
              Study modern directions and choose the area that matches your
              goals, interests, and future profession.
            </p>
          </div>

          <div className="discover-cards">
            {trendingTopics.map((item) => (
              <div
                key={item.id}
                className="discover-topic-card"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="discover-topic-overlay">
                  <h4>{item.title}</h4>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Index;