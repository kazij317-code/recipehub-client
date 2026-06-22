import { redirect } from "next/navigation";

const UserHomepage = () => {
  redirect("/dashboard");
};

export default UserHomepage;
