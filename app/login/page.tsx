import Footer from "@/components/footer";
import { login, signup } from "./actions";
import ProductCard from "@/components/product-card";

export default function LoginPage() {
  return (
    // <form>
    //   <label htmlFor="email">Email:</label>
    //   <input id="email" name="email" type="email" required />
    //   <label htmlFor="password">Password:</label>
    //   <input id="password" name="password" type="password" required />
    //   <button formAction={login}>Log in</button>
    //   <button formAction={signup}>Sign up</button>
    // </form>
    // <Footer />
    <ProductCard />
  );
}
