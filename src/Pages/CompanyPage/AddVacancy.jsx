import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddVacancy() {
    const user = useSelector((state) => state.user.user)
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newVacancy = {
            title,
            description,
            location,
            salary,
            companyId: user.id
        };

        const response = await fetch("http://localhost:3001/vacancies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newVacancy),
        });

        if (response.ok) {
            toast.success("Vacancy added successfully!");
            setTitle("");
            setDescription("");
            setLocation("");
            setSalary("");
            navigate(`/profile/company/${user.id}`)
        } else {
            alert("Failed to add vacancy");
        }
    };


    return (
        <div className="add-gallery-container">
            <h1>Add Vacancy (Only for Companies)</h1>

            <form onSubmit={handleSubmit} className="gallery-add-container">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                />
                <button type="submit">Add Vacancy</button>
            </form>
        </div>
    );
}

export default AddVacancy;
