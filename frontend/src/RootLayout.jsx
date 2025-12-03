import { Outlet, useNavigation } from "react-router-dom";
import { useLoading } from "./components/context/LoadingContext";
import Loader from "./components/Loader";

export default function RootLayout() {
  const navigation = useNavigation();
  const { isLoading, setIsLoading } = useLoading();

  // ⭐ Route loading detection
  if (navigation.state === "loading") {
    setIsLoading(true);
  } else {
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <Loader />}
      <Outlet />
    </>
  );
}
