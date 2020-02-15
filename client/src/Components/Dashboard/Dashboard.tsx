import React, { useContext } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SOCIAL_PROVIDERS = gql`
  query socialProviders {
    addSocialProvider
  }
`;

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthenticationContext);
  const { data } = useQuery(SOCIAL_PROVIDERS);

  return (
    <p>
      Hello {user?.given_name} {user?.family_name}
    </p>
  );
};

export default Dashboard;
