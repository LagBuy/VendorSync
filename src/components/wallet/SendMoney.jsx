import "./SendMoney.css";
import mastercard from "../../assets/mastercard.png";
import profile from "../../assets/profile.jpg";
import nigeriaflag from "../../assets/ng-flag.svg";
import usaflag from "../../assets/us-flag.png";

const SendMoney = () => {
  return (
    <div className="send-money">
      <h2 className="title">Monthly Revenue 💰</h2>

      {/* THE BALANCE */}
      <div className="row balance">
        <div>
          <h1>$2,450.00</h1>
          <p>
            <span className="success">-3%</span> [$73.50]
          </p>
        </div>

        {/*  ADD MONEY BUTTON: */}
        <button className="add-fund-btn">
          {/* ADD THE CEO's WhatsApp Link */}
          <a href="">
            <img src={mastercard} className="icon" alt="" />
          </a>
          Text the CEO
        </button>
      </div>

      {/* THE AMOUNT TO BE ADDED: */}
      <div className="amount">
        <div className="row user">
          <div className="profile">
            <img src={profile} alt="" />
          </div>
          <p className="muted">Withdraw Here</p>
        </div>

        <div className="row price-input">
          <p className="currency">$</p>
          <input type="number" placeholder="0.00" required />
          <div className="row">
            <div className="profile">
              <img src={nigeriaflag} alt="" />
            </div>

            {/*  THE AMERICAN FLAG */}
            <div className="profile">
              <img src={usaflag} alt="" />
            </div>
          </div>
        </div>

        {/*  */}
        <button className="btn btn-primary send-money-btn">
          Send to local bank
        </button>
      </div>
    </div>
  );
};

// ONLY POSITIVE NUMBER WILL BE INPUTED DURING TRANSACTION:

export default SendMoney;
