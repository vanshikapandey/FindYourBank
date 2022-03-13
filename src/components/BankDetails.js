import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function BankDetails() {
  const [loading, setLoading] = useState(true);
  const [bankData, setBankData] = useState();
  const [error, setError] = useState();
  const { ifsc } = useParams();
  const city = window.localStorage.getItem("CurrentCity");
  useEffect(() => {
    getBanks();
  }, [ifsc]);

  function getBanks() {
    if (window.localStorage.getItem(city)) {
      setBankData(
        JSON.parse(window.localStorage.getItem(city)).filter(
          (e) => e.ifsc === ifsc
        )
      );
      setLoading(false);
      return;
    }
    //api call
    axios
      .get(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`)
      .then((response) => {
        setBankData(response.data.filter((e) => e.ifsc === ifsc));
        window.localStorage.setItem(city, JSON.stringify(response.data));
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        console.log(error);
      });
  }

  //edge case
  if (bankData?.length === 0) {
    return <p id="text">Invalid IFSC Code!</p>;
  }

  return loading ? (
    <div className="loader">
      <ClipLoader color={"#5468ff"} size={64} />
    </div>
  ) : (
    <div>
      <p id="text">Bank Details</p>
      <div className="card">
        <p>Bank Name : {bankData[0].bank_name}</p>
        <br />
        <p>Bank IFSC : {bankData[0].ifsc}</p>
        <br />
        <p>Bank Branch : {bankData[0].branch}</p>
        <br />
        <p>Bank Id : {bankData[0].bank_id}</p>
        <br />
        <p>Bank Address{bankData[0].address}</p>
        <br />
      </div>
    </div>
  );
}

export default BankDetails;
