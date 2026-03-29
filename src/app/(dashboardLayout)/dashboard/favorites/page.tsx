import FavoritesPage from "@/components/modules/favorite/FavoritesPage";
import { getMyFavoritesAction } from "@/actions/favoriteActions/_getMyFavoritesAction";

const DashboardFavoritesPage = async () => {
  const result = await getMyFavoritesAction();

  return (
    <FavoritesPage
      favorites={result.data}
      error={result.success ? undefined : result.error}
    />
  );
};

export default DashboardFavoritesPage;
