import type { ParamMatcher } from '@sveltejs/kit';

export const match = (param => /^\d+$/.test(param)) satisfies ParamMatcher;
