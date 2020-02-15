import React, { useContext } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";

const Dashboard: React.FC = () => {
  const { idToken } = useContext(AuthenticationContext);

  return (
    <p>
      Hello {idToken?.given_name} {idToken?.family_name}
    </p>
  );
};

export default Dashboard;
