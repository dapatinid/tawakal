import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/neraca',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BalanceController::index
* @see app/Http/Controllers/BalanceController.php:15
* @route '/neraca'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const BalanceController = { index }

export default BalanceController