import "./header.css";
import Logo from "../assets/react.svg";

function Header() {
    return (
        <div className="header-section">
            <img src={Logo} className="logo" alt="logo" />
            Item scanner
        </div>
    );
}

export default Header;
