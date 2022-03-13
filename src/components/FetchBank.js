import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function FetchBank() {
  const [banks, setBanks] = useState([]);
  const [error, setError] = useState(null);
  const [currCity, setCurrCity] = useState("DELHI");
  const [currCat, setCurrCat] = useState("bank_name");
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);

  let navigateTo = useNavigate();

  useEffect(() => {
    getBanks();
    window.localStorage.setItem("CurrentCity", currCity);
  }, [currCity]);

  useEffect(() => {
    getFavourites();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Favourites", JSON.stringify(favouriteList));
  }, [favouriteList]);

  useEffect(() => {
    setTableData(getPaginatedArray(banks));
    setLoading(false);
  }, [pageNo, pageSize, banks]);

  function getBanks() {
    setLoading(true);

    const currTime = new Date().getTime();

    //Local Storage for Caching
    if (window.localStorage.getItem(`timeStamp${currCity}`)) {
      const devTime = Number(
        window.localStorage.getItem(`timeStamp${currCity}`)
      );
      const diff = currTime - devTime;

      if (diff >= milliSecondsForTimeout) {
        window.localStorage.removeItem(currCity);
      }
    }

    if (window.localStorage.getItem(currCity)) {
      console.log("local");
      setBanks(JSON.parse(window.localStorage.getItem(currCity)));
      setLoading(false);
      return;
    }
    // API Call
    axios
      .get(`https://vast-shore-74260.herokuapp.com/banks?city=${currCity}`)
      .then((response) => {
        window.localStorage.setItem(currCity, JSON.stringify(response.data));
        window.localStorage.setItem(
          `timeStamp${currCity}`,
          currTime.toString()
        );

        setBanks(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  }

  //Navigation to Bank Detail Page
  function getBankDetails(e) {
    navigateTo(`/bank-details/${e.ifsc}`);
  }

  //Getting Favourite Banks List
  const getFavourites = () => {
    if (window.localStorage.getItem("Favourites")) {
      setFavouriteList(JSON.parse(window.localStorage.getItem("Favourites")));
      setLoading(false);
    } else {
      console.log("empty");
    }
  };

  //Pagination
  function getPaginatedArray(arr) {
    const start = pageNo * pageSize;
    const end = Number(start) + Number(pageSize);

    return arr.filter((e, i) => i >= start && i < end);
  }

  const prevPage = () => {
    setPageNo((prevState) => (prevState === 0 ? 0 : prevState - 1));
  };

  const nextPage = () => {
    setPageNo((prevState) =>
      prevState === banks.length / pageSize - 1 ? prevState : prevState + 1
    );
  };

  const handleChange = (e) => {
    console.log(e);
    const value = e.target.value;
    console.log(value);
    setPageNo(0);
    setTableData(
      getPaginatedArray(
        banks.filter((bank) => {
          if (value === "") {
            return true;
          } else {
            return bank[currCat]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
          }
        })
      )
    );
  };

  const debounce = (fn) => {
    let timer;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("hello");
        fn.apply(context, args);
      }, 200);
    };
  };

  const getBanksData = debounce(handleChange);

  const isFavourite = (ifsc) => {
    if (favouriteList.find((e) => e.ifsc === ifsc)) {
      return true;
    } else {
      return false;
    }
  };

  if (error) {
    console.log(error);
    return <div>Something went wrong!</div>;
  }

  return (
    <div>
      {loading ? (
        <div className="loader">
          <ClipLoader color={"#5468ff"} size={64} />
        </div>
      ) : (
        <>
          <div>
            <div className="filters">
              <div className="searchBar">
                <i className="fa fa-search searchIcon"></i>
                <input
                  className="search form-control"
                  type="search"
                  onChange={getBanksData}
                  placeholder="Search..."
                />
              </div>

              <form className="d-flex">
                <label htmlFor="city">Select City:</label>
                <select
                  name="city"
                  id="city"
                  className="form-select"
                  value={currCity}
                  onChange={(e) => {
                    setCurrCity(e.target.value);
                    setPageNo(0);
                    setLoading(true);
                  }}
                >
                  <option value="MUMBAI">MUMBAI</option>
                  <option value="DELHI">DELHI</option>
                  <option value="BANGALORE">BANGALORE</option>
                  <option value="JAIPUR">JAIPUR</option>
                  <option value="HYDERABAD">HYDERABAD</option>
                </select>
              </form>

              <form className="d-flex">
                <label htmlFor="category">Select Category:</label>
                <select
                  name="category"
                  id="category"
                  className="form-select"
                  value={currCat}
                  onChange={(e) => setCurrCat(e.target.value)}
                >
                  <option value="bank_name">Bank</option>
                  <option value="ifsc">IFSC</option>
                  <option value="branch">Branch</option>
                  <option value="bank_id">Bank ID</option>
                  <option value="address">Address</option>
                </select>
              </form>
            </div>
            {
              //table display
              <div>
                <p id="text">All Banks</p>
                <table className="table table-responsive " id="banks">
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
                    {tableData.map((bank, i) => (
                      <tr key={i} onClick={() => getBankDetails(bank)}>
                        <td>
                          {isFavourite(bank.ifsc) ? (
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
                          ) : (
                            <button
                              onClick={(e) => {
                                setFavouriteList((prevList) => [
                                  ...prevList,
                                  bank,
                                ]);
                                e.stopPropagation();
                              }}
                            >
                              +
                            </button>
                          )}
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
            }
            <div className="pagination">
              <form className="d-flex">
                <label htmlFor="pageSize">Rows Per Page:</label>
                <select
                  name="pageSize"
                  id="pageSize"
                  value={pageSize}
                  className="form-select"
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    setPageNo(0);
                  }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </form>
              <div className="d-flex">
                <button className="page" onClick={prevPage}>
                  &lt;
                </button>
                <div>{pageNo}</div>

                <button className="page" onClick={nextPage}>
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const milliSecondsForTimeout = 1000 * 60 * 15;
export default FetchBank;
