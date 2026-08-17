import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
export const index = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/@{branch}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
index.url = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
index.get = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
index.head = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
const indexForm = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
indexForm.get = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderNowController::index
* @see app/Http/Controllers/OrderNowController.php:16
* @route '/@{branch}'
*/
indexForm.head = (args: { branch: string | number | { slug: string | number } } | [branch: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const OrderNowController = { index }

export default OrderNowController