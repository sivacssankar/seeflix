import { NavLink } from "react-router-dom";




function Navbar() {
    var user=localStorage.getItem("userid")


    return <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="navbar-brand">
            <h4>seeflix</h4>
        </div>
        <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
        <div
        className="collapse navbar-collapse mr-auto"
        id="navbarNav"
        style={{ float: "left" }}        >


            <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                <li className="nav-item">
                <NavLink to={"/"} className="nav-link">
                    welcome page
                </NavLink>
                </li>

                <li className="nav-item">
              {user ? (
                    <NavLink to={"/homepage"} className="nav-link">
                Home
              </NavLink>
                ) : (
              <NavLink to={"/"} className="nav-link">
                Home
              </NavLink>
                )}
            </li>



                <li className="nav-item">
                <NavLink to={"/register"} className="nav-link">
                    Register
                </NavLink>
                </li>


                <li className="nav-item">
                <NavLink to={"/login"} className="nav-link">
                   Login
                </NavLink>
                </li>


                
                <li className="nav-item">
                <NavLink to={"/watch"} className="nav-link">
                   watchlist
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to={"/history"} className="nav-link">
                   History
                </NavLink>
                </li>

                
<li className="nav-item">
                <NavLink to={"/user"} className="nav-link">
                   profile
                </NavLink>
                </li>

            </ul>
           
        </div>
    </nav>;
}

export default Navbar;