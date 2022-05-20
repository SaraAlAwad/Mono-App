import "./Home.css"; //
import Navbar from "../Components/Navbar";
import BalanceCard from "../Components/BalanceCard";
import TransactionHistoryList from "../Components/TransactionHistoryList";
import HeaderLine from "../Components/HeaderLine";
// import {useProfileInfo} from "../hooks/useProfileInfo"
import { showWalletOfMonths } from "../hooks/showWalletOfMonths";
const Home = (props) => {
  // const profileInfo = useProfileInfo(props.token)
  const profileWallet = showWalletOfMonths(props.token);
  return (
    <main className="home">
      <div className="home-header">
        <HeaderLine title="Home" />
      </div>
      <div className="content">
        <BalanceCard profileWallet={profileWallet} />
        <TransactionHistoryList profileWallet={profileWallet} />
        <Navbar />
      </div>
    </main>
  );
};

export default Home;
