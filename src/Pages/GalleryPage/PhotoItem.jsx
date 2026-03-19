import { useContext } from "react";
import { AuthContext, GalleryContext } from "../../App";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";

function PhotoItem({ galleryItem }) {
    const user = useSelector((state) => state.user.user);

    const { users } = useContext(AuthContext);
    const { gallery, setGallery } = useContext(GalleryContext);

    const author = users.find(user => user.id === galleryItem.authorId);

    async function buyGallery() {
        const purchase = {
            photoId: galleryItem.id,
            userId: user.id
        };

        const response = await fetch(`http://localhost:3001/cart-photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(purchase)
        })

        if (response.ok) {
            toast.success(`Товар добавлен в корзину ${user.username}`)
        } else {
            toast.error("Ошибка");
        }
    }

    async function DeletePhoto(id) {
        const response = await fetch(`http://localhost:3001/gallery/${id}`, {
            method: "DELETE"
        })

        if (response.ok) {
            setGallery(gallery.filter(gall => gall.id !== id));
            toast.success("Фотография удалена")
        } else {
            toast.error("Ошибка")
        }
    }

    return (
        <>
            <div className="gallery-card">
                <img src={"./img/IndexPage/" + galleryItem.imageUrl} alt={galleryItem.title} className="gallery-img" />
                <div className="gallery-info">
                    <h3>{galleryItem.title}</h3>
                    <p>{galleryItem.description}</p>
                    <span className="gallery-author">By <Link to={`/profile/professor/${author.id}`}>{author ? author.username : 'Unknown'}</Link></span>
                    {user && user.role === "user" && (
                        <button className="gallery-buy" onClick={buyGallery}>SAVE PHOTO</button>
                    )}
                    {user && user.role === "professor" && galleryItem.authorId === user.id && (
                        <button className="gallery-buy"><Link to={`/edit-photo/${galleryItem.id}`}>EDIT PHOTO</Link></button>
                    )}
                    {user && user.role === "admin" && (
                        <button className="delete-btn" onClick={() => DeletePhoto(galleryItem.id)}>DELETE PHOTO</button>
                    )}
                </div>
            </div>
        </>
    )
}

export default PhotoItem;