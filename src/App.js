import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./Pages/IndexPage/IndexPage";
import GalleryPage from "./Pages/GalleryPage/GalleryPage";
import { createContext, useState, useEffect } from "react";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import AddGalleryItem from "./Pages/GalleryPage/AddGalleryItem";
import Edit from "./Components/Edit";
import PhotoshootsPage from "./Pages/PhotoshootsPage/PhotoshootsPage";
import EditPhoto from "./Pages/GalleryPage/EditPhoto";
import CompanyPage from "./Pages/CompanyPage/CompanyPage";
import ProfileSwitch from "./Components/ProfileSwitch";
import AddPhotoshoot from "./Pages/PhotoshootsPage/AddPhotoshoot";
import AddVacancy from "./Pages/CompanyPage/AddVacancy";
import Vacancies from "./Pages/CompanyPage/Vacancies";
import EditPhotoshoot from "./Pages/PhotoshootsPage/EditPhotoshoot";
import RefillBalance from "./Components/RefilBalance";
import { useSelector } from "react-redux";

export const AuthContext = createContext();
export const GalleryContext = createContext();
export const PhotoshootsContext = createContext();

function App() {
  const theme = useSelector((state) => state.theme.theme);


  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  const [users, setUsers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [photoshoots, setPhotoshoots] = useState([]);


  useEffect(() => {
    fetch(`http://localhost:3001/gallery`)
      .then(response => response.json())
      .then(data => setGallery(data));

    fetch(`http://localhost:3001/users`)
      .then(response => response.json())
      .then(data => setUsers(data));

    fetch(`http://localhost:3001/photoshoots`)
      .then(response => response.json())
      .then(data => setPhotoshoots(data));
  }, [])

  return (

    <AuthContext.Provider value={{ users }}>
      <GalleryContext.Provider value={{ gallery, setGallery }}>
        <PhotoshootsContext.Provider value={{ photoshoots, setPhotoshoots }}>
          <div className="wrapper">
            <BrowserRouter>
              <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />

                <Route path="/" element={<IndexPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/add-item" element={< AddGalleryItem />} />
                <Route path="/edit-photo/:id" element={<EditPhoto />} />

                <Route path="/photoshoots" element={<PhotoshootsPage />} />
                <Route path="/add-photoshoot" element={<AddPhotoshoot />} />
                <Route path="/edit-photoshoot/:id" element={<EditPhotoshoot />} />

                <Route path="/company" element={<CompanyPage />} />

                <Route path="/refill-balance/:id" element={<RefillBalance />} />

                <Route path="/profile/:role/:id" element={<ProfileSwitch />} />

                <Route path="/add-vacancy" element={<AddVacancy />} />
                <Route path="/all-vacancies/:id" element={<Vacancies />} />
                <Route path="/edit" element={<Edit />} />

              </Routes>
            </BrowserRouter>
          </div>
        </PhotoshootsContext.Provider>
      </GalleryContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;