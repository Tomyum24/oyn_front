import { useContext, useState } from "react";
import { GalleryContext } from "../../App";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";

function AddGalleryItem() {
    const user = useSelector((state) => state.user.user);

    const { gallery, setGallery } = useContext(GalleryContext);

    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)

    async function AddGallery(e) {
        e.preventDefault();

        if (!image) {
            toast.error("Выбери фотографию")
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await fetch("http://localhost:4000/upload", {
            method: "POST",
            body: formData
        });

        const uploadData = await uploadRes.json();

        const newItem = {
            title,
            description,
            imageUrl: uploadData.filename,
            authorId: user.id
        }

        const response = await fetch(`http://localhost:3001/gallery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItem)
        })

        const createdItem = await response.json();
        setGallery([...gallery, createdItem]);

        if (response.ok) {
            toast.success("Пост добавлен");
            navigate("/");
        } else {
            toast.error("Ошибка");
        }

    }

    return (
        <>
            <div className="add-gallery-container">
                <h1>Add new Photo (Only for photographers)</h1>

                <form onSubmit={AddGallery} className="gallery-add-container">

                    <input type="text" placeholder="Title..." required onChange={(e) => setTitle(e.target.value)} value={title} />

                    <textarea placeholder="Description..." required onChange={(e) => setDescription(e.target.value)} value={description}></textarea>

                    <input type="file" accept="image*" onChange={(e) => setImage(e.target.files[0])} />
                    {/* <input type="text" placeholder="Image Url: (for example: sunset.jpg)" required onChange={(e) => setImageUrl(e.target.value)} /> */}

                    <button type="submit" >Add Photo</button>
                </form>
            </div>
        </>
    )
}

export default AddGalleryItem;