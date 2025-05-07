import React from "react";
import "./styles/main.scss";

import Header from "./components/Header";
import StockCard from "./components/StockCard";
import MacroPanel from "./components/MacroPanel";
import PatternDetection from "./components/PatternDetection";
import SectorChart from "./components/SectorChart";
import TargetCard from "./components/TargetCard";
import NewsFeed from "./components/NewsFeed";
import StockNews from "./components/StockNews";

const App = () => {
  return (
    <div className="container-fluid px-4 py-3">
      <Header />
      <div>
        <div className="row col-12 g-3 mt-3">
          <div className="col-4">
            <StockCard />
          </div>
          <div className="col-8">
            <MacroPanel />
            <PatternDetection />
          </div>
        </div>
        <div className="row col-12 g-3">
          <div className="col-4">
            <SectorChart />
            <div className="row">
              <div className="col-6">
                <TargetCard type="short" />
              </div>
              <div className="col-6">
                <TargetCard type="long" />
              </div>
            </div>
          </div>
          <div className="col-8">
            <StockNews />
          </div>
        </div>

        <div className="row col-12 g-3">
          <div className="col-6">
            <NewsFeed title="India News & Sentiment" />
          </div>
          <div className="col-6">
            <NewsFeed title="Global News & Sentiment" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;



// import React from 'react';
// import Header from './components/Header';
// import MacroPanel from './components/MacroPanel';
// import NewsFeed from './components/NewsFeed';
// import PatternDetection from './components/PatternDetection';
// import SectorChart from './components/SectorChart';
// import StockCard from './components/StockCard';
// import TargetCard from './components/TargetCard';
// import StockNews from './components/StockNews';
// import './styles/App.scss';
// import './styles/main.scss';

// const App = () => {
//   return (
//     <div className="container mt-4">
//       <Header />

//       <MacroPanel />

//       <div className="row g-4">
//         <div className="col-md-8">
//           <div className="row g-4">
//             <div className="col-md-6">
//               <StockCard />
//             </div>
//             <div className="col-md-6">
//               <TargetCard type="short" />
//             </div>
//             <div className="col-md-6">
//               <TargetCard type="long" />
//             </div>
//             <div className="col-md-6">
//               <PatternDetection />
//             </div>
//           </div>
//         </div>

//         <div className="col-md-4">
//           <NewsFeed title="India News & Sentiment" />
//         </div>
//       </div>

//       <div className="row g-4 mt-4">
//         <div className="col-md-8">
//           <StockNews />
//         </div>
//         <div className="col-md-4">
//           <SectorChart />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;