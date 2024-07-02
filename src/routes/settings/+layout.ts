import type { LayoutLoad } from './$types';

export const load = (async ({parent}) => {
    const parentData = await parent();
    return {
        ...parentData,
    };
}) satisfies LayoutLoad;