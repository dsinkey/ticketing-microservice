import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('I am in the component', currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  console.log(req.headers);
  if (typeof window === 'undefined') {
    const url =
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser';

    const { data } = await axios.get(url, {
      headers: req.headers,
    });

    console.log({ data });

    return data;
  } else {
    const { data } = await axios.get('/api/users/currentuser');
    console.log('data', data);

    return data;
  }

  return {};
};

export default LandingPage;
