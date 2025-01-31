import StreamVideoProvider from "../components/providers/StreamClientProvider";


function Layout({ children }: { children: React.ReactNode }) {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}
export default Layout;

//why the (root)/layout ?
//because we dont want the admin group to have these functionalities adn want this only in this group 