import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
export const store = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: store.url(args, options),
    method: 'get',
})

store.definition = {
    methods: ["get","head"],
    url: '/@{branch}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
store.url = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { branch: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            branch: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        branch: typeof args.branch === 'object'
        ? args.branch.slug
        : args.branch,
    }

    return store.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
store.get = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: store.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
store.head = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: store.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
const storeForm = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: store.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
storeForm.get = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: store.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderNowController::store
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
storeForm.head = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: store.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

store.form = storeForm

const ordernow = {
    store: Object.assign(store, store),
}

export default ordernow