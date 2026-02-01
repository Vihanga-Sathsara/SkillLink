import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface Category {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export const getCategories = async () => {
  const categoriesCol = collection(db, "categories");
  const categoriesSnapshot = await getDocs(categoriesCol);
  const categoriesList: Category[] = categoriesSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        name: doc.data().name,
        icon: doc.data().icon,
        active: doc.data().active,
      }) as Category,
  );
  return categoriesList;
};
