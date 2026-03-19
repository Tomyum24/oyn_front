import { useContext, useState } from "react";
import { PhotoshootsContext } from "../../App";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";

function AddPhotoshoot() {
    const user = useSelector((state) => state.user.user)

    const navigate = useNavigate();

    const { photoshoots, setPhotoshoots } = useContext(PhotoshootsContext);

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    const [image, setImage] = useState(null);

    async function AddPhotoshoot() {
        if (!image) {
            toast.error("Выберите фотографию")
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await fetch(`http://localhost:4000/upload`, {
            method: "POST",
            body: formData
        })

        const uploadData = await uploadRes.json();

        const newPhotoshoot = {
            title,
            description,
            price: parseInt(price, 10),
            authorId: user.id,
            imageUrl: uploadData.filename
        };

        const response = await fetch(`http://localhost:3001/photoshoots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPhotoshoot)
        })

        if (response.ok) {
            const createdPhotoshoot = await response.json();
            setPhotoshoots([...photoshoots, createdPhotoshoot]);
            toast.success("Photoshoot added")
            navigate("/")
        } else {
            toast.error("Ошибка")
        }
    }


    return (
        <>
            <div className="add-gallery-container">
                <h1>Add new Photoshoot (Only for photographers)</h1>

                <div className="gallery-add-container">

                    <input type="text" placeholder="Title..." required onChange={(e) => setTitle(e.target.value)} value={title} />

                    <textarea placeholder="Description..." required onChange={(e) => setDescription(e.target.value)} value={description}></textarea>

                    <input type="number" placeholder="Price..." required onChange={(e) => setPrice(e.target.value)} value={price} />

                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                    {/* <input type="text" placeholder="Image Url: (for example: family.jpg)" required onChange={(e) => setImageUrl(e.target.value)} /> */}

                    <button onClick={AddPhotoshoot}>Add Photoshoot</button>
                </div>
            </div>
        </>
    )
}

export default AddPhotoshoot;