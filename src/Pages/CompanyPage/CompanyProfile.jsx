import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from "../../redux/userSlice";

function CompanyProfile() {
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()

    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/users/${id}`)
            .then(response => response.json())
            .then(data => setProfile(data));
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
            setProfile(prev => ({ ...prev, avatarUrl: filename }))

            const updatedUser = { ...user, avatarUrl: filename };
            dispatch(setUser(updatedUser))
            localStorage.setItem("user", JSON.stringify(updatedUser))
            
            setAvatar(null);
            toast.success("Аватар обновлён!");
        } else {
            alert("Ошибка при обновлении профиля");
        }
    }

    async function UpdateLogo() {
        if (!logo) return;

        const formData = new FormData();
        formData.append("image", logo);

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
            body: JSON.stringify({ logo: filename }),
        });

        if (patchRes.ok) {
            setProfile(prev => ({ ...prev, logo: filename }))

            setUser(prev => ({ ...prev, logo: filename }))
            const updatedUser = { ...user, logo: filename };
            localStorage.setItem("user", JSON.stringify(updatedUser))

            setAvatar(null);
            toast.success("Лого обновлено!");
        } else {
            alert("Ошибка при обновлении профиля");
        }
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
                                alt="" />
                        </div>
                        <div className="home-container">
                            <h1>COMPANY PROFILE:</h1>
                            <div className="home-content">
                                <h2 className="profile-username">
                                    COMPANY NAME: {profile.companyName}
                                </h2>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Role:</strong> {profile.role}</p>

                                {user && user.id === profile.id && (
                                    <div>
                                        <p>Update Photo</p>
                                        <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
                                        <br /><br />
                                        <button className="edit-btn" disabled={!avatar} onClick={UpdatePhoto}>Update Photo</button>
                                    </div>
                                )}

                                {user && user.id === profile.id && (
                                    <div>
                                        <p>Update Company Logo</p>
                                        <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
                                        <br /><br />
                                        <button className="edit-btn" disabled={!logo} onClick={UpdateLogo}>Update Photo</button>
                                    </div>
                                )}

                                {user && user.id === profile.id && (
                                    <div>
                                        <p>Change password:</p>
                                        <button className="profile-btn" onClick={() => navigate("/edit")} >
                                            Change
                                        </button>
                                    </div>
                                )}

                                {user && profile && user.id === profile.id && (
                                    <div>
                                        <button onClick={() => navigate("/add-vacancy")} className="profile-btn">
                                            Add Vacancy
                                        </button>
                                    </div>
                                )}
                                {user && profile && (user.id === profile.id || user.role === "professor") && (
                                    <div>
                                        <button className="profile-btn" onClick={() => navigate(`/all-vacancies/${profile.id}`)}>
                                            All Vacancies
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
                <button className="back-btn" onClick={() => navigate("/company")}>
                    Back
                </button>
            </div>

        </>
    );
}

export default CompanyProfile;
