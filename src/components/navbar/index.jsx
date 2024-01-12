import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <div>
      <nav className="bg-nav-color p-6 flex flex-row">
        <div className="container mx-auto flex flex-row items-center justify-between text-neutral-200">
          <div>
            <Link
              to="/"
              className="text-black text-lg lg:text-3xl font-extrabold tracking-tight"
            >
              Mealspo
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
