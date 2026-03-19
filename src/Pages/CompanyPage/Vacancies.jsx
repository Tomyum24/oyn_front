import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Vacancies() {
    const user = useSelector((state) => state.user.user)
    
    const { id } = useParams();
    const navigate = useNavigate();

    const [vacancies, setVacancies] = useState([]);
    const [registeredVac, setRegisteredVac] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/vacancies`)
            .then(response => response.json())
            .then(data => setVacancies(data));

        fetch("http://localhost:3001/vacancyRegistrations")
            .then(response => response.json())
            .then(data => {
                const registered = data
                    .filter(reg => reg.photographerId === user.id)
                    .map(reg => reg.vacancyId);
                setRegisteredVac(registered);
            });
    }, [user.id]);

    const filteredVacancies = vacancies.filter(vac => vac.companyId === id)

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this vacancy?");
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:3001/vacancies/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Vacancy deleted successfully!");
            setVacancies((prev) => prev.filter((v) => v.id !== id));
        } else {
            alert("Failed to delete vacancy");
        }
    };

    const handleRegister = async (vacancyId) => {
        const registration = {
            vacancyId,
            photographerId: user.id,
        };

        const postRes = await fetch("http://localhost:3001/vacancyRegistrations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registration),
        });

        if (postRes.ok) {
            alert("Successfully registered!");
            setRegisteredVac(prev => [...prev, vacancyId]);
        } else {
            alert("Failed to register.");
        }
    };

    return (
        <>
            <div className="vacancy-list">
                <div className="vacancy-buttons">    
                    <h2>All Vacancies</h2>
                    <button className="your-vac" onClick={() => navigate(`/profile/professor/${user.id}`)}>Your vanancies</button>
                </div>
                
                {filteredVacancies.map((vacancy) => (
                    <div key={vacancy.id} className="vacancy-item">
                        <strong>{vacancy.title}</strong> - {vacancy.location} - ${vacancy.salary}
                        <p>{vacancy.description}</p>
                        <strong>{ }</strong>
                        {user && user.role === "company" && (
                            <button onClick={() => handleDelete(vacancy.id)} className="edit-btn">Delete</button>
                        )}
                        {user && user.role === "professor" && (
                            <button
                                className="register-btn"
                                disabled={registeredVac.includes(vacancy.id)}
                                onClick={() => handleRegister(vacancy.id)}
                            >
                                {registeredVac.includes(vacancy.id)
                                    ? "Already Registered"
                                    : "Register"}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button className="back-btn" onClick={() => navigate(`/profile/company/${id}`)}>
                Back
            </button>
        </>
    )
}

export default Vacancies;