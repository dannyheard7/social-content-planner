import React, { useContext } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";


const Dashboard: React.FC = () => {
  const { user } = useContext(AuthenticationContext);

  return (
    <p>
      Hello {user?.given_name} {user?.family_name}
    </p>
  );
};

export default Dashboard;
