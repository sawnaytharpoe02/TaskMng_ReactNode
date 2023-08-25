import { useState } from 'react';
import { RouterProvider } from 'react-router';
import router from './routes/routes';
import { NetworkErrorProvider } from './context/networkErrContext';
import MenuContext from './context/menuContext';
import VerifyContext from './context/verifyContext';
import UpdateUserContext from './context/updateUserContext';

const App = () => {
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [updateUserContent, setUpdateUserContent] = useState(false);

  return (
    <MenuContext.Provider value={{ currentMenuItem, setCurrentMenuItem }}>
      <VerifyContext.Provider value={{ verifyEmail, setVerifyEmail }}>
        <UpdateUserContext.Provider value={{ updateUserContent, setUpdateUserContent }}>
          <NetworkErrorProvider>
            <RouterProvider router={router}></RouterProvider>
          </NetworkErrorProvider>
        </UpdateUserContext.Provider>
      </VerifyContext.Provider>
    </MenuContext.Provider>
  );
};

export default App;
