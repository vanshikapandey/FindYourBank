import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function Favourite() {
  const [favouriteList, setFavouriteList] = useState([]);
  const [loading, setLoading] = useState(true);

  let navigateTo = useNavigate();

  useEffect(() => {
    getFavourites();
  }, []);

  //local storage
  useEffect(() => {
    window.localStorage.setItem("Favourites", JSON.stringify(favouriteList));
  }, [favouriteList]);

  const getFavourites = () => {
    if (window.localStorage.getItem("Favourites")) {
      setFavouriteList(JSON.parse(window.localStorage.getItem("Favourites")));
      setLoading(false);
    }
  };
  //navigation to bank details
  function getBankDetails(e) {
    navigateTo(`/bank-details/${e.ifsc}`);
  }
  //edge case
  if (favouriteList.length === 0) {
    return <p id="text">No records to display.</p>;
  }

  return (
    <div>
      {loading ? (
        <div className="loader">
          <ClipLoader color={"#5468ff"} size={64} />
        </div>
      ) : (
        <div>
          <p id="text">Favorites</p>
          <table className="table table-responsive" id="banks">
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
