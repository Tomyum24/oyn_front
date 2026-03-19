import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoshootsContext } from "../../App";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function EditPhotoshoot() {
    const { id } = useParams();
    const { setPhotoshoots } = useContext(PhotoshootsContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState();

    const [showModal, setShowModal] = useState(false);



    useEffect(() => {
        async function fetchPhotoshoot() {
            const response = await fetch(`http://localhost:3001/photoshoots/${id}`);
            if (response.ok) {
                const photoshoot = await response.json();
                setTitle(photoshoot.title);
                setDescription(photoshoot.description);
                setPrice(photoshoot.price);
            } else {
                alert("Ошибка")
            }
        }
        fetchPhotoshoot();
    }, [id]);

    async function updatePhotoshoot() {
        const updatedPhotoshoot = { title, description, price };

        const response = await fetch(`http://localhost:3001/photoshoots/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPhotoshoot),
        })

        if (response.ok) {
            const data = await response.json();
            setPhotoshoots(prev => prev.map(item => (item.id === id ? data : item)));
            toast.success("Photoshoot successfully updated");
            navigate("/photoshoots");
        } else {
            alert("Ошибка при обновлении")
        }
    }

    return (


        <>
            <div className="add-gallery-container">
            {showModal && (
    <div className="modal-backdrop">
        <div className="modal-content">
            <h3>Are you sure you want to save the changes?</h3>
            <div className="modal-buttons">
                <button onClick={() => {
                    updatePhotoshoot();
                    setShowModal(false);
                }}>Yes</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}

                <h1>Edit Photoshoot (Only for photographers)</h1>
                <div className="gallery-add-container">

                    <input type="text" placeholder="Title..." required onChange={(e) => setTitle(e.target.value)} value={title} />

                    <textarea placeholder="Description..." required onChange={(e) => setDescription(e.target.value)} value={description}></textarea>

                    <input type="number" placeholder="Price..." required onChange={(e) => setPrice(e.target.value)} value={price} />

                    {/* <input type="text" placeholder="Image Url: (for example: family.jpg)" required onChange={(e) => setImageUrl(e.target.value)} value={imageUrl} /> */}

                    <button onClick={() => setShowModal(true)}>Save Changes</button>
                </div>
            </div>
        </>
    )
}

export default EditPhotoshoot;