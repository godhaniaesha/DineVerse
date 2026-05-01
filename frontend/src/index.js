import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './contexts/AuthContext';
import { StaffProvider } from './contexts/StaffContext';
import { RoomProvider } from './contexts/RoomContext';
import { MenuProvider } from './contexts/MenuContext';
import { GalleryProvider } from './contexts/GalleryContext';
import { TableProvider } from './contexts/TableContext';
import { TableReservationProvider } from './contexts/TableReservationContext';
import { ReservationProvider } from './contexts/ReservationContext';
import { OrderProvider } from './contexts/OrderContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// ✅ Root Provider (clean structure)
const RootProviders = ({ children }) => {
  return (
    <AuthProvider>
      <StaffProvider>
        <RoomProvider>
          <MenuProvider>
            <GalleryProvider>
              <TableProvider>
                <TableReservationProvider>
                  <ReservationProvider>
                    <OrderProvider>
                      <SubscriptionProvider>
                        {children}
                      </SubscriptionProvider>
                    </OrderProvider>
                  </ReservationProvider>
                </TableReservationProvider>
              </TableProvider>
            </GalleryProvider>
          </MenuProvider>
        </RoomProvider>
      </StaffProvider>
    </AuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RootProviders>
      <App />
    </RootProviders>
  </React.StrictMode>
);

reportWebVitals();