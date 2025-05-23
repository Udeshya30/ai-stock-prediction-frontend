// // src/components/Header.jsx
// import React from 'react';
// import { Search } from 'lucide-react';
// import dayjs from 'dayjs';
// import './Header.scss';


// const Header = () => {
//   const currentTime = dayjs().format('ddd, MMM D • HH:mm');

//   return (
//     <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//       <h4 className="mb-0">AI Stock Whisper</h4>

//       <div className="d-flex align-items-center gap-3">
//         <div className="input-group input-group-sm">
//           <span className="input-group-text bg-dark border-dark text-white">
//             <Search size={16} />
//           </span>
//           <input
//             type="text"
//             className="form-control bg-dark border-dark text-white"
//             placeholder="Search stocks..."
//           />
//         </div>
//         <small className="text-muted">{currentTime}</small>
//       </div>
//     </div>
//   );
// };

// export default Header;
// Header.jsx
import React from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the English locale
import './Header.scss';

const Header = () => {
  const currentTime = dayjs().locale('en').format('ddd, MMM D • HH:mm');

  return (
    <div className="header-bar d-flex justify-content-between align-items-center border-bottom pb-2">
      <h4>AI Stock Whisper</h4>
      <div className="d-flex align-items-center">
        <div className="input-group me-3">
          <label htmlFor="search-input" className="visually-hidden">Search stocks...</label>
          <span className="input-group-text bg-dark border-dark">
            <Search className="text-white" size={16} />
          </span>
          <input
            type="text"
            id="search-input"
            className="form-control bg-dark border-dark text-white"
            placeholder="Search stocks..."
          />
        </div>
        <span className="current-time text-secondary">{currentTime}</span>
      </div>
    </div>
  );
};

export default Header;