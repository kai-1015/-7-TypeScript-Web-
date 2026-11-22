import { Link } from "react-router-dom";


export default function Header() {
	return (
		<header className="bg-gray-800 text-white py-4">
			<div className="container mx-auto px-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">
					<Link to="/">
						Blog
					</Link>
				</h1>

				<nav>
					<Link to="/contact" className="hover:text-gray-300">
						お問い合わせ
					</Link>
				</nav>
			</div>
		</header>
	)
}