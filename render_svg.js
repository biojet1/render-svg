#!/usr/bin/env node
import('render-svg/cli')
	.then(({ main }) => main())
	.catch((err) => {
		throw err;
	});
