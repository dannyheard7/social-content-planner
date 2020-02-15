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
  const { idToken } = useContext(AuthenticationContext);
  const { data } = useQuery(SOCIAL_PROVIDERS);

  return (
    <p>
      Hello {idToken?.given_name} {idToken?.family_name}
    </p>
  );
};

export default Dashboard;
