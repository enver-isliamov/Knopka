import React from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";

const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const HeartBeatIcon = () => {
	//<!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path
				fill="#ff5a5a"
				d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
			/>
		</svg>
	);
};

function App() {
	const pointsElement = document.getElementById("points");
	const playButtonElement = document.getElementById("play-button");

	const [gameStarted, setGameStarted] = useState(false);
	const [happiness, setHappiness] = useState(100);
	const [happinessBoostPoints, setHappinessBoostPoints] = useState(0);
	const [time, setTime] = useState(0);
	const [src, setSrc] = useState(
		"https://assets.codepen.io/324712/love-pet.svg"
	);
	const [petMessage, setPetMessage] = useState("Let's play!");

	const timeoutRef = useRef();

	//HELPER FUNCTIONS
	//https://css-tricks.com/restart-css-animation/
	const animate = () => {
		// -> removing the class
		pointsElement.classList.remove("run-animation");
		playButtonElement.classList.remove("button-30");

		// -> triggering reflow /* The actual magic */
		// without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
		// This was, from the original tutorial, will no work in strict mode. Thanks Felis Phasma! The next uncommented line is the fix.
		// element.offsetWidth = element.offsetWidth;

		void pointsElement.offsetWidth;
		playButtonElement.offsetWidth;

		// -> and re-adding the class
		pointsElement.classList.add("run-animation");
		playButtonElement.classList.add("button-30");
	};

	const stayInRange = (stat) => {
		if (stat >= 0 && stat <= 100) return stat;
		else if (stat > 100) return 100;
		else return 0;
	};

	const accurateInterval = function (fn, time) {
		let cancel, nextAt, timeout, wrapper, timeoutID;
		nextAt = new Date().getTime() + time;
		timeout = null;
		wrapper = function () {
			nextAt += time;
			timeout = setTimeout(wrapper, nextAt - new Date().getTime());
			return fn();
		};
		cancel = function () {
			return clearTimeout(timeout);
		};
		// eslint-disable-next-line
		timeoutID = function () {
			return timeout;
		};
		timeout = setTimeout(wrapper, nextAt - new Date().getTime());
		return timeout;
	};

	const beginLife = () => {
		let timeOutInfo = accurateInterval(() => {
			petDay();
		}, 1000);
		timeoutRef.current = timeOutInfo;
		//console.log(timeoutRef.current);
	};

	const petDay = () => {
		setHappiness((prev) => {
			return stayInRange(prev - (Math.floor(Math.random() * 4) + 1));
		});

		setTime((prev) => {
			return prev + 1;
		});
	};

	const playPet = () => {
		if (gameStarted) {
			let randomHappinessBoostPoints = Math.floor(Math.random() * 4) + 1;
			setHappinessBoostPoints(randomHappinessBoostPoints);
			animate();

			setHappiness((prev) => stayInRange(prev + randomHappinessBoostPoints));
		} else {
			setGameStarted(true);
		}
	};

	useEffect(() => {
		if (gameStarted) {
			beginLife();
		}
	}, [gameStarted]);

	useEffect(() => {
		if (happiness >= 70 && happiness <= 90) {
			setSrc("https://assets.codepen.io/324712/happy-pet.svg");
			setPetMessage("Singing my best songs!");
		} else if (happiness <= 40 && happiness > 10) {
			setSrc("https://assets.codepen.io/324712/sad-pet.svg");
			setPetMessage("Feeling very sad...Play?");
		} else if (happiness > 90) {
			setSrc("https://assets.codepen.io/324712/love-pet.svg");
			if (gameStarted) {
				setPetMessage("Feeling Loved!");
			}
		} else if (happiness <= 10) {
			setSrc("https://assets.codepen.io/324712/crying-pet.svg");
			setPetMessage("Crying now...");
		} else {
			setSrc("https://assets.codepen.io/324712/welcome-pet.svg");
			setPetMessage("What's happening?");
		}
	}, [gameStarted, happiness]);

	const cleanup = () => {
		//Cancel timers
		if (timeoutRef.current) {
			timeoutRef.current.cancel();
		}
		timeoutRef.current = null;
	};

	return (
		<>
			<div class="main-container">
				<div id="character">
					<img
						alt="Pippin the Chick, the Hero of this Tamagotchi-Inspired Virtual Pet Game"
						src={src}
					/>
					<p class="info">
						<strong>{petMessage}</strong>
					</p>
				</div>
				<div id="button-container">
					<p id="points" tabindex="0">
						{gameStarted ? "+" + happinessBoostPoints + " points" : ""}
					</p>
					<button
						id="play-button"
						onClick={() => {
							playPet();
						}}
						type="button"
						className="button-30"
					>
						<i>
							<HeartBeatIcon />
						</i>
					</button>
					<p>{gameStarted ? "Love" : "Start Game"}</p>
					<p class="info">
						Current Happiness: <strong>{happiness} %</strong>
					</p>
					<p class="info">
						Time: <strong>{time}</strong> second(s)
					</p>
				</div>
			</div>
			<footer>
				<p>
					<strong>HINT:</strong> Every second the happiness levels will drop by a
					random factor. Share your love with your pet chick by pressing the love
					button. Keep your Virtual Pet from crying as much as you can! Good luck!
				</p>
				
				<small>
					Tamagotchi-Inspired Virtual Pet Game {new Date().getFullYear()}
				</small>
			</footer>
		</>
	);
}

root.render(
	<>
		<App />
	</>
);
