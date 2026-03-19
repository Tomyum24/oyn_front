import { useContext } from "react";
import { GalleryContext } from "../../App";

import { Link } from "react-router-dom";

import PhotoItem from "./PhotoItem";
import { useSelector } from "react-redux";

function GalleryItems() {
    const user = useSelector((state) => state.user.user)
    const { gallery } = useContext(GalleryContext);

    return (
        <>
            <div className="gallery-content">
                <h1>Our Gallery</h1>
                <p>Explore a curated collection of beautiful photographs, each capturing unique moments and perspectives. From serene landscapes to urban scenes, our gallery showcases the work of talented photographers.</p>
            </div>

            {user && user.role === "professor" && (
                <div className="gallery-add">
                    <button><Link to="/add-item">Add new Photo (Only for photographers)</Link></button>
                </div>
            )}

            <div className="gallery-container">
                {gallery.map((galleryItem) => (
                    <PhotoItem key={galleryItem.id} galleryItem={galleryItem} />
                ))}
            </div>

        </>
    )
}

export default GalleryItems;