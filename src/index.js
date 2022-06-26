import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

// Import thirdweb provider and Rinkeby ChainId
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"

const activeChainId = ChainId.Rinkeby

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
)
