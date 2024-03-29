#!/usr/bin/env node
import('svgrast/cli')
	.then(({ main }) => main())
	.catch((err) => {
		throw err;
	});
