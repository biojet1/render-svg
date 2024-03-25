#!/usr/bin/env node
import('render-svg')
	.then(({ main }) => main())
	.catch((err) => {
		throw err;
	});
