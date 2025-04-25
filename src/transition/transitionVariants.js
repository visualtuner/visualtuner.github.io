export const variants = {
    forward: {
		initial: { opacity: 1, y: "100%" },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 1, y: "100%" },
	},
	backward: {
		initial: { opacity: 1, y: 0 },
		animate: { opacity: 1, y: "100%" },
		exit: { opacity: 1, y: "100%" },
	},
};

export const transition = {
	duration: 0.6,
	ease: "easeInOut",
};
