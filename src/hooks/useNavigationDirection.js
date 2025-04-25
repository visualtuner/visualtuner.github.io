import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

let lastIndex = window.history.state?.idx || 0;

export default function useNavigationDirection() {
	const location = useLocation();
	const [direction, setDirection] = useState("forward");

	useEffect(() => {
		const currentIndex = window.history.state?.idx || 0;

		if (currentIndex > lastIndex) {
			setDirection("forward");
            console.log("방향: forward");
		} else if (currentIndex < lastIndex) {
			setDirection("backward");
            console.log("방향: backward");
		}

		lastIndex = currentIndex;
	}, [location]);

	return direction;
}
