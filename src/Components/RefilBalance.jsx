import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

function RefillBalance() {
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()

    const { id } = useParams();
    const navigate = useNavigate();

    const [amount, setAmount] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch(`http://localhost:3001/users/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        }
        fetchProfile();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const refillAmount = parseFloat(amount);

        if (isNaN(refillAmount) || refillAmount <= 0) {
            toast.error("Введите корректную сумму");
            return;
        }

        const newBalance = profile.balance + refillAmount;

        const res = await fetch(`http://localhost:3001/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ balance: newBalance }),
        });

        if (res.ok) {
            setProfile(prev => ({ ...prev, balance: newBalance }));

            const updatedUser = { ...user, balance: newBalance };
            dispatch(setUser(user))
            localStorage.setItem("user", JSON.stringify(updatedUser))

            toast.success(`Баланс пополнен на ${refillAmount} KZT`);
            navigate(`/profile/${profile.role}/${id}`);
        } else {
            toast.error("Ошибка при пополнении баланса");
        }
    };

    return (
        <>
            <div className="refill-container">
                <h1>Refill Balance</h1>
                {profile ? (
                    <form onSubmit={handleSubmit} className="refill-form">
                        <label htmlFor="amount">Amount (KZT):</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            required
                        />
                        <button type="submit" className="edit-btn">Refill</button>
                    </form>
                ) : (
                    <p>Загрузка профиля...</p>
                )}
            </div>
            <button className="back-btn" onClick={() => navigate(`/profile/${profile.role}/${id}`)}>Back</button>
        </>
    );
}

export default RefillBalance;
