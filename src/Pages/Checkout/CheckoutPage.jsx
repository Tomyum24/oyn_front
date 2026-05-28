import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { toast } from "react-toastify";
import { apiFetch } from "../../lib/api";
import styles from "./CheckoutPage.module.css";

function generateRef() {
  return String(Math.floor(Math.random() * 900000000000) + 100000000000);
}

function formatDateTime(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function PaymentSuccess({ course, price, user, refNumber, paidAt, onDone }) {
  return (
    <div className={styles.successWrapper}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className={styles.successTitle}>Payment Success!</h2>
        <p className={styles.successSubtitle}>Your payment has been successfully done.</p>

        <div className={styles.receiptBox}>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Amount</span>
            <span className={styles.receiptAmount}>${Number(price).toFixed(2)}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Payment Status</span>
            <span className={styles.successBadge}>Success</span>
          </div>
          <hr className={styles.receiptDivider} />
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Ref Number</span>
            <span className={styles.receiptValue}>{refNumber}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Course</span>
            <span className={styles.receiptValue}>{course?.title}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Payment Method</span>
            <span className={styles.receiptValue}>Credit Card</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Payment Time</span>
            <span className={styles.receiptValue}>{formatDateTime(paidAt)}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Sender</span>
            <span className={styles.receiptValue}>{user?.name || user?.email || "Student"}</span>
          </div>
        </div>

        <div className={styles.successActions}>
          <button className={styles.receiptBtn} onClick={() => window.print()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Get PDF Receipt
          </button>
          <button className={styles.doneBtn} onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  const statePrice = location.state?.price;
  const stateCourse = location.state?.course;

  const [course, setCourse] = useState(stateCourse || null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [refNumber] = useState(generateRef);
  const [paidAt] = useState(() => new Date());

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (stateCourse) return;

    apiFetch(`/api/courses/${slug}`)
      .then((data) => {
        const resolvedPrice = data.price ?? statePrice ?? null;
        setCourse({ ...data, price: resolvedPrice });
      })
      .catch(() => {
        toast.error("Course not found");
        navigate("/courses");
      });
  }, [slug, user, navigate, stateCourse, statePrice]);

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePay = async () => {
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Enter a valid card number");
      return;
    }
    if (expiry.length < 5) {
      toast.error("Enter a valid expiration date");
      return;
    }
    if (cvv.length < 3) {
      toast.error("Enter a valid CVV");
      return;
    }

    setLoading(true);
    try {
      await apiFetch(`/api/enrollments/courses/${slug}`, { method: "POST" });
    } catch (err) {
      if (err.status !== 409) {
        toast.error(err.message || "Payment failed");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setPaid(true);
  };

  const handleDone = () => {
    if (course?.lessons?.length > 0) {
      navigate(`/courses/${slug}/lessons/${course.lessons[0].slug}`);
    } else {
      navigate(`/courses/${slug}`);
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

  const price = course.price ?? statePrice ?? 0;

  if (paid) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <PaymentSuccess
          course={course}
          price={price}
          user={user}
          refNumber={refNumber}
          paidAt={paidAt}
          onDone={handleDone}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Header />

      <div className={styles.container}>
        {/* LEFT — Payment */}
        <div className={styles.paymentSection}>
          <h2 className={styles.sectionTitle}>Payment</h2>
          <hr className={styles.divider} />

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Card Number</label>
            <input
              className={styles.input}
              placeholder="1234 5678 9101 1121"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Expiration Date</label>
              <input
                className={styles.input}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>CVV</label>
              <input
                className={styles.input}
                placeholder="123"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
            Save card details
          </label>

          <button
            className={styles.payBtn}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${Number(price).toFixed(2)}`}
          </button>

          <p className={styles.disclaimer}>
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>
        </div>

        {/* RIGHT — Order Summary */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          <hr className={styles.divider} />

          <div className={styles.courseRow}>
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                className={styles.courseThumb}
              />
            )}
            <div className={styles.courseInfo}>
              <p className={styles.courseTitle}>{course.title}</p>
              <p className={styles.courseLevel}>{course.level?.toLowerCase()}</p>
            </div>
            <p className={styles.coursePrice}>${Number(price).toFixed(2)}</p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.discountRow}>
            <input
              className={styles.discountInput}
              placeholder="Gift or discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button className={styles.applyBtn}>Apply</button>
          </div>

          <hr className={styles.divider} />

          <div className={styles.summaryLine}>
            <span>Subtotal</span>
            <span>${Number(price).toFixed(2)}</span>
          </div>

          <hr className={styles.divider} />

          <div className={styles.totalLine}>
            <div>
              <p className={styles.totalLabel}>Total</p>
              <p className={styles.taxNote}>No additional taxes</p>
            </div>
            <p className={styles.totalAmount}>${Number(price).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
