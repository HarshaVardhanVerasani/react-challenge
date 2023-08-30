import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillHeartFill, BsSearch } from "react-icons/bs";
import "./Home.css";
function Home() {
  const [breeds, setBreeds] = useState([]);
  const [breedTypes, setBreedTypes] = useState([]);
  const [value, setValue] = useState("samoyed");
  const [favoriteList, setFavoriteList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `https://dog.ceo/api/breed/${value}/images`
      );

      //creating with dog list with only 10 results
      const dogs =
        data.message.length >= 11 ? data.message.slice(0, 10) : data.message;

      //creating object list of keys imgSrc and isFavorite(isFav)
      setBreeds(
        dogs.map((img) => ({
          imgSrc: img,
          isFav: false,
        }))
      );

      //removing loading text
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllBreeds = async () => {
    try {
      const { data } = await axios.get("https://dog.ceo/api/breeds/list/all");
      setBreedTypes(Object.keys(data.message));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    fetchDogs();
  };

  const handleFavorite = (src) => {
    const favoriteItem = breeds.find((item) => item.imgSrc === src);
    favoriteItem.isFav = !favoriteItem.isFav;

    if (favoriteItem.isFav) {
      const updatedFavList = [favoriteItem, ...favoriteList];
      setFavoriteList(updatedFavList);
    } else if (!favoriteItem.isFav) {
      const removedItemFromFavList = favoriteList.filter(
        (item) => item.imgSrc !== src
      );
      setFavoriteList(removedItemFromFavList);
    }
  };

  //on initial render
  useEffect(() => {
    fetchDogs();
    fetchAllBreeds();
  }, []);

  console.log(breeds);

  return (
    <>
      <header className="header container my-4">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="title">Dog Breeds</h1>
          <BsFillHeartFill
            style={{
              color: "red",
            }}
          />
        </div>
        <section className="search my-3">
          <input
            type="text"
            className="input"
            list="breedTypes"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <datalist id="breedTypes">
            {breedTypes.map((item, idx) => (
              <option value={item} key={idx}></option>
            ))}
          </datalist>
          <button className="btn-search" onClick={handleSearch}>
            <BsSearch />
            Search
          </button>
        </section>
      </header>
      <main className="main container">
        {isLoading && <p className="text-center">Loading...</p>}
        <section className="dog-breeds">
          {breeds.length > 0 &&
            breeds.map((item) => (
              <div className="image" key={item.imgSrc}>
                <img
                  src={item.imgSrc}
                  alt="dog"
                  className="img-fluid"
                  style={{
                    aspectRatio: "1/1",
                    objectFit: "fill",
                    borderRadius: "0.3rem",
                  }}
                />
                <div onClick={() => handleFavorite(item.imgSrc)}>
                  {item.isFav ? (
                    <BsFillHeartFill className="red-heart" />
                  ) : (
                    <BsFillHeartFill className="white-heart" />
                  )}
                </div>
              </div>
            ))}
        </section>
        <hr className="line" />
        <h5 className="container fw-bold">
          <BsFillHeartFill
            style={{
              color: "red",
              marginRight: "0.6rem",
            }}
          />
          Favorites
        </h5>
        <section className="favorite-list">
          {favoriteList.map((item) => (
            <div className="image" key={item.imgSrc}>
              <img
                src={item.imgSrc}
                alt="dog"
                className="img-fluid"
                style={{
                  aspectRatio: "1/1",
                  objectFit: "fill",
                  borderRadius: "0.3rem",
                }}
              />
              <div onClick={() => handleFavorite(item.imgSrc)}>
                {item.isFav ? (
                  <BsFillHeartFill className="red-heart" />
                ) : (
                  <BsFillHeartFill className="white-heart" />
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

export default Home;
