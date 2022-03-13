import React from "react";

function Navbar() {
  return (
    <div>
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">
            Find Your Bank
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/favourite">
            Favourite
          </a>
        </li>
      </ul>
    </div>
    //   <div className=ame="navBar">
    //     <a href="/">Find Your Bank</a>
    //     <a href="/favourite">Favourite</a>
    //   </div>
    // </div>
  );
}

export default Navbar;
