import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
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
    axios
      .get(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`)
      .then((response) => {
        setBankData(response.data.filter((e) => e.ifsc === ifsc));
        window.localStorage.setItem(city, JSON.stringify(response.data));
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  }

  console.log(bankData);
  if (bankData?.length === 0) {
    return <div>Invalid IFSC Code!</div>;
  }

  return loading ? (
    <Loader />
  ) : (
    <div>
      Bank Details
      <div>
        {bankData[0].bank_name}
        <br />
        {bankData[0].ifsc}
        <br />
        {bankData[0].branch}
        <br />
        {bankData[0].bank_id}
        <br />
        {bankData[0].address}
        <br />
      </div>
    </div>
  );
}

export default BankDetails;
