import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function Favourite() {
  const [favouriteList, setFavouriteList] = useState([]);

  const [loading, setLoading] = useState(true);

  let navigateTo = useNavigate();

  useEffect(() => {
    getFavourites();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Favourites", JSON.stringify(favouriteList));
  }, [favouriteList]);

  const getFavourites = () => {
    if (window.localStorage.getItem("Favourites")) {
      setFavouriteList(JSON.parse(window.localStorage.getItem("Favourites")));
      setLoading(false);
    } else {
      console.log("empty");
    }
  };

  function getBankDetails(e, ifsc) {
    console.log(e);
    navigateTo(`/bank-details/${e.ifsc}`);
  }

  if (favouriteList.length === 0) {
    return <div>No records to display.</div>;
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <p id="bankList">Favorites</p>
          <table id="banks">
            <thead>
              <tr>
                <th>Favourite</th>
                <th>Bank</th>
                <th>IFSC</th>
                <th>Branch</th>
                <th>Bank ID</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {favouriteList.map((bank, i) => (
                <tr key={i} onClick={() => getBankDetails(bank)}>
                  <td>
                    <button
                      onClick={(e) => {
                        setFavouriteList((prevList) =>
                          prevList.filter((e) => e.ifsc !== bank.ifsc)
                        );
                        e.stopPropagation();
                      }}
                    >
                      -
                    </button>
                  </td>
                  <td>{bank.bank_name}</td>
                  <td>{bank.ifsc}</td>
                  <td>{bank.branch}</td>
                  <td>{bank.bank_id}</td>
                  <td>{bank.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
