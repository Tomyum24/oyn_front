import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

function PhotographerProfile() {
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()

    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [registeredVacancies, setRegisteredVacancies] = useState([]);

    useEffect(() => {
        async function fetchProfileAndVacancies() {
            const res = await fetch(`http://localhost:3001/users/${id}`);
            if (!res.ok) return;
            const userProfile = await res.json();
            setProfile(userProfile);

            const regRes = await fetch("http://localhost:3001/vacancyRegistrations");
            const regs = await regRes.json();

            const myRegs = regs.filter(reg => reg.photographerId === userProfile.id);
            const vacancyIds = myRegs.map(reg => reg.vacancyId);

            const allVacRes = await fetch("http://localhost:3001/vacancies");
            const allVacancies = await allVacRes.json();

            const filteredVacancies = allVacancies.filter(v => vacancyIds.includes(v.id));
            setRegisteredVacancies(filteredVacancies);
        }

        fetchProfileAndVacancies();
    }, [id]);

    async function UpdatePhoto() {
        if (!avatar) return;

        const formData = new FormData();
        formData.append("image", avatar);

        const uploadRes = await fetch("http://localhost:4000/upload", {
            method: "POST",
            body: formData,
        });

        if (!uploadRes.ok) {
            alert("Ошибка при загрузке файла на сервер");
            return;
        }

        const { filename } = await uploadRes.json();

        const patchRes = await fetch(`http://localhost:3001/users/${profile.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatarUrl: filename }),
        });

        if (patchRes.ok) {
            setProfile(prev => ({ ...prev, avatarUrl: filename }));

            const updatedUser = { ...user, avatarUrl: filename };
            dispatch(setUser(updatedUser))
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setAvatar(null);
            toast.success("Avatar updated!");
        } else {
            alert("Ошибка при обновлении профиля");
        }
    }

    async function handleUnregister(vacancyId) {
        try {
            // Получаем все регистрации
            const res = await fetch("http://localhost:3001/vacancyRegistrations");
            const allRegistrations = await res.json();

            // Находим нужную регистрацию
            const registration = allRegistrations.find(
                r => r.vacancyId === vacancyId && r.photographerId === profile.id
            );

            if (!registration) {
                toast.error("Регистрация не найдена");
                return;
            }

            // Удаляем её
            const deleteRes = await fetch(`http://localhost:3001/vacancyRegistrations/${registration.id}`, {
                method: "DELETE",
            });

            if (deleteRes.ok) {
                setRegisteredVacancies(prev => prev.filter(v => v.id !== vacancyId));
                toast.success("Registration canceled");
            } else {
                toast.error("Ошибка при удалении");
            }
        } catch (err) {
            toast.error("Произошла ошибка");
            console.error(err);
        }
    }

    function handleEdit() {
        navigate("/edit");
    }

    return (
        <>
            <div className="theme-dark">
                {profile && (
                    <section className="home" id="home">
                        <div className="home-img">
                            <img
                                src={
                                    profile.avatarUrl
                                        ? `/img/IndexPage/${profile.avatarUrl}`
                                        : "/img/IndexPage/default-avatar.jpg"
                                }
                                className="profile-avatar"
                                alt="Avatar"
                            />
                        </div>
                        <div className="home-container">
                            <h1>professor PROFILE:</h1>
                            <div className="home-content">
                                <h2 className="profile-username">NAME: {profile.username}</h2>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Role:</strong> {profile.role}</p>
                                <p><strong>Specialization:</strong> {profile.specialization}</p>

                                {user && user.id === profile.id && (
                                    <>
                                        <div>
                                            <p><strong>Your sales: {profile.sales}</strong></p>

                                            <p>Update Photo</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setAvatar(e.target.files[0])}
                                            />
                                            <br /><br />
                                            <button className="edit-btn" disabled={!avatar} onClick={UpdatePhoto}>
                                                Update Photo
                                            </button>
                                        </div>
                                        <div>
                                            <p>Change password:</p>
                                            <button className="profile-btn" onClick={handleEdit}>
                                                Change
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {user && profile && user.id === profile.id && (
                    <div className="registered-list">
                        <h2>Registered Vacancies</h2>
                        <div className="registered-container">
                            {registeredVacancies.length === 0 ? (
                                <p>You haven't registered for any vacancies yet.</p>
                            ) : (
                                registeredVacancies.map(v => (
                                    <div key={v.id} className="registered-item">
                                        <p><strong>{v.title}</strong> — {v.location} — ${v.salary}</p>
                                        <p>{v.description}</p>
                                        <button className="cancel-btn" onClick={() => handleUnregister(v.id)}>CANCEL</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


                <button className="back-btn" onClick={() => navigate("/gallery")}>
                    Back
                </button>
            </div>
        </>
    );
}

export default PhotographerProfile;
