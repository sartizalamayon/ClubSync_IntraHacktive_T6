import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/Routes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          
        </AuthProvider>
      </QueryClientProvider> 
    </HelmetProvider>  */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)