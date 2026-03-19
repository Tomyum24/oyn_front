import Feature from "./Feature";
import { Link } from "react-router-dom";

function Index() {

    return (
        <>
            <div className="index-container">

                <div className="index-photo">
                    <img src="./img/IndexPage/index-photo.png" alt="" />
                </div>

                <div className="index-content">

                    <div className="index-text">
                        <h1>OYN - a place <br />where start your learning</h1>
                        <p>Your creativity, our inspiration
                            Whatever your story, set if free.</p>
                    </div>
                </div>
            </div>

            <div className="about-container">

                <div className="about-content">

                    <div className="about-text">
                        <p className="about-subtitle">GET TO KNOW US</p>
                        <h1>Why we make it happens</h1>
                        <p>Your ceremony & reception venues, your
                            vision, your dress, your colours, and anything
                            else you would like.</p>
                    </div>

                    <button className="about-button">
                        <Link to="/gallery">Check our Gallery</Link>
                    </button>
                </div>

                <div className="about-image">
                    <img src="./img/IndexPage/index-second.png" alt="Event planning" />
                </div>

            </div>

            <div className="choose-container">
                <h1 className="choose-title">Why Choose Us</h1>

                <div className="features">
                    <Feature photo="cat1.jpg" title="Career" text="Your creativity our inspiration. Whate ever your want" />
                    <Feature photo="cat2.jpg" title="Inspiration" text="Your creativity our inspiration. Whate ever your want" />
                    <Feature photo="cat3.ARW" title="Bumblebee" text="Your creativity our inspiration. Whate ever your want" />
                </div>

            </div>
        </>
    )
}

export default Index;