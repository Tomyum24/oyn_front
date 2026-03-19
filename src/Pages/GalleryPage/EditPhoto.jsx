import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GalleryContext } from "../../App";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function EditPhoto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setGallery } = useContext(GalleryContext);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        async function fetchPhoto() {
            const response = await fetch(`http://localhost:3001/gallery/${id}`);
            if (response.ok) {
                const photo = await response.json();
                setTitle(photo.title);
                setDescription(photo.description);
            } else {
                alert("Ошибка")
            }
        }
        fetchPhoto();
    }, [id]);

    async function updatePhoto() {
        const updatedPhoto = { title, description };

        const response = await fetch(`http://localhost:3001/gallery/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPhoto),
        })

        if (response.ok) {
            const data = await response.json();
            setGallery(prev => prev.map(item => (item.id === id ? data : item)));
            toast.success("Photo successfully updated");
            navigate("/gallery");
        } else {
            alert("Ошибка при обновлении")
        }
    }

    return (
        <div className="add-gallery-container">
            <h1>Edit Photo (Only for photographers)</h1>
            <div className="gallery-add-container">

                <input type="text" placeholder="Title..." required onChange={(e) => setTitle(e.target.value)} value={title} />

                <textarea placeholder="Description..." required onChange={(e) => setDescription(e.target.value)} value={description}></textarea>

                {/* <input type="text" placeholder="Image Url: (for example: sunset.jpg)" required onChange={(e) => setImageUrl(e.target.value)} value={imageUrl}/> */}

                <button onClick={updatePhoto}>Save Changes</button>
            </div>
        </div>
    );
}

export default EditPhoto;
