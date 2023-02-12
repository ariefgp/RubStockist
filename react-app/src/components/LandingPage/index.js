import React from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";
import phone_hero_image from "../../images/LandingPage/phone_hero_image.png";
import crypto_hero_image from "../../images/LandingPage/crypto_hero_image.png";

const LandingPage = () => {
	const history = useHistory();

	const handleSignUp = () => {
		history.push("/sign-up");
	};

	const handleLogin = () => {
		history.push("/login");
	};

	return (
		<div className="landing-page-container">
			<div className="landing-page-content">
				<div className=""></div>
				<div className="grid lg:grid-cols-1 h-[50vh] lg:h-screen w-screen bg-[url('static/media/splash_background_image.a7e1489e.png')] bg-no-repeat bg-cover bg-center">
					<div className="flex items-center justify-center lg:order-first sm:order-last">
						<ul>
							<li>
								<h1 className="p-3 text-8xl font-extrabold text-[#39443a]">
									Welcome to Archer
								</h1>
							</li>
							<li>
								<h2 className="p-3 text-4xl font-semibold text-[#39443a]">
									The ultimate trading platform for the modern investor
								</h2>
							</li>
						</ul>
					</div>
				</div>
				<div className="grid lg:grid-cols-3 md:grid-cols-1">
					<div className="p-8 flex items-center justify-center">
						<img src={phone_hero_image} className="max-w-md" />
					</div>
					<div className="p-8 flex items-center justify-center lg:col-span-2 md:col-span-1">
						<ul>
							<li className="md:text-2xl sm:text-4xl font-semibold">
								Real-time stock market data and insights
							</li>
							<li className="md:text-2xl sm:text-4xl font-semibold">
								Easy-to-use interface for buying and selling stocks
							</li>
							<li className="md:text-2xl sm:text-4xl font-semibold">
								Commission-free trading on a wide range of stocks and ETFs
							</li>
						</ul>
					</div>
				</div>
				<div className="grid lg:grid-cols-3  md:grid-cols-1">
					<div className="p-8 lg:col-span-2 md:col-span-1 flex items-center justify-center lg:order-first sm:order-last">
						<ul>
							<li className="md:text-2xl sm:text-4xl font-semibold">
								Advanced charting tools for technical analysis
							</li>
							<li className="md:text-2xl sm:text-4xl font-semibold">
								Customizable watchlists to track your favorite stocks
							</li>
						</ul>
					</div>
					<div className="p-8 flex items-center justify-center lg:order-last sm:order-first">
						<img src={crypto_hero_image} className="max-w-md m-auto" />
					</div>
				</div>
				<button
					className="border-2 border-black rounded-2xl p-2.5 bg-zinc-100 m-2"
					onClick={() => handleSignUp()}
				>
					Sign Up
				</button>
				<p>
					Already have an account? &nbsp;
					<a onClick={() => handleLogin()}>Log in</a>
				</p>
			</div>
		</div>
	);
};

export default LandingPage;
