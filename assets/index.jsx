import "./VisaCard.css";
import world from "../../assets/world.svg";
import chip from "../../assets/chip.png";
import visa from "../../assets/visa.png";
import partern from "../../assets/partern.jpg";

const VisacCard = () => {
  return (
    <div className="visa-card">
      <div className="visa-card-inner">
        <div className="front">
          <img src={world} className="map-img" alt="" />
          <div className="row">
            <img src={chip} className="icon" alt="" />
            <img src={visa} className="icon" alt="" />
          </div>

          {/* ROW CARD NO */}
          <div className="row card-no">
            <p>1234</p>
            <p>4567</p>
            <p>8910</p>
            <p>5432</p>
          </div>

          {/* ROW CARD HOLDER */}
          <div className="row card-holder">
            <p>CARD HOLDER</p>
            <p>VALID TILL</p>
          </div>

          {/* ROW NAME */}
          <div className="row name">
            <p>JOSHUA TOBE</p>
            <p>09/28</p>
          </div>
        </div>

        {/* BACK OF THE CARD */}
        <div className="back">
          <img src={world} className="map-img" alt="" />
          <div className="bar"></div>
          <div className="row card-cvv">
            <div>
              <img src={partern} alt="" />
            </div>
            <p>678</p>
          </div>

          {/* THE CARD TEXT */}
          <div className="row card-text">
            <p>
              LagWallet's virtual card enables secure instant payment, giving
              you access to funds and seamless financial management.
            </p>
          </div>

          {/* ROW SIGNATURE COMPONENT */}
          <div className="row signature">
            <p>CUSTOMER SIGNATURE</p>
            <img src={visa} className="icon" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisacCard;
