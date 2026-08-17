import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pembayaran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembayaranController::index
* @see app/Http/Controllers/PembayaranController.php:15
* @route '/pembayaran'
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

const pembayaran = {
    index: Object.assign(index, index),
}

export default pembayaran