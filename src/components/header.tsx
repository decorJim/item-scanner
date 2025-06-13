import "./header.css";
import Logo from "../assets/react.svg";

function handleClick(label: string) {
    alert(`${label} button clicked`);
}

function Header() {
    return (
        <div className="header-section">
            <div className="title-container">
                <img src={Logo} className="logo" alt="logo" />
                <h1 className="header-title">Item scanner</h1>
            </div>
            <div className="header-buttons">
                <button className="header-btn" onClick={() => handleClick('Home')}>Home</button>
                <button className="header-btn" onClick={() => handleClick('Scan')}>Scan</button>
                <button className="header-btn" onClick={() => handleClick('About')}>About</button>
            </div>
        </div>
    );
}

export default Header;
