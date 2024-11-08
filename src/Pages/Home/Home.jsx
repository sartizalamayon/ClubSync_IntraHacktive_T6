import Nav from "../Navbar/Nav";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Home"} | ClubSync</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Nav></Nav>
      <div></div>
    </>
  );
};

export default Home;
