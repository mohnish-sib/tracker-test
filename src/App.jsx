import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// const InjectedScript = () => {
//   useEffect(() => {
//     const script = document.createElement("script");

//     script.innerHTML = `
//       (function() {
//         window.addEventListener('load', () => {
//           setTimeout(() => {
//             const popup = window.open('', 'popup', 'width=300,height=200');
//             popup.document.write(\`
//               <html>
//                 <head>
//                   <title>Popup</title>
//                 </head>
//                 <body>
//                   <h1>Hello, this is a popup!</h1>
//                   <p>This popup appears 5ms after the page loads.</p>
//                 </body>
//               </html>
//             \`);
//           }, 5);
//         });
//       })();
//     `;

//     document.head.appendChild(script);

//     // Clean up the script when the component unmounts
//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   return null; // This component does not render anything visible
// };

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <InjectedScript /> */}
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div id="check-me"> check me</div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
