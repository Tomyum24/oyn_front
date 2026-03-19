function Feature({ photo, title, text }) {
    return (
        <>
            <div className="feature">
                <div className="feature-icon">
                    <img src={`./img/IndexPage/${photo}`} alt="Editing" />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-text">{text}</p>
            </div>
        </>
    )
}

export default Feature;