import { useContext } from "react";
import { PhotoshootsContext } from "../../App";

import { Link } from "react-router-dom";
import PhItem from "./PhItem";

import { useSelector } from "react-redux";

function PhotoshootsItems() {
    const user = useSelector((state) => state.user.user)
    const { photoshoots } = useContext(PhotoshootsContext);

    return (
        <>
            <div className="photoshoot-content">
                <h1>Available Photoshoots</h1>
            </div>

            {user && user.role === "professor" && (
                <div className="gallery-add">
                    <button><Link to="/add-photoshoot">Add new Photoshoot (Only for photographers)</Link></button>
                </div>
            )}

            <div className="photoshoots-container">
                {photoshoots.map(photoshoot => (
                    <PhItem photoshoot={photoshoot} key={photoshoot.id} />
                ))}
            </div>
        </>
    )
}

export default PhotoshootsItems;