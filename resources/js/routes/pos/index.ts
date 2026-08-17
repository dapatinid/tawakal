import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POSController::index
* @see app/Http/Controllers/POSController.php:21
* @route '/pos'
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

/**
* @see \App\Http\Controllers\POSController::checkout
* @see app/Http/Controllers/POSController.php:108
* @route '/pos/checkout'
*/
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/pos/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POSController::checkout
* @see app/Http/Controllers/POSController.php:108
* @route '/pos/checkout'
*/
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POSController::checkout
* @see app/Http/Controllers/POSController.php:108
* @route '/pos/checkout'
*/
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POSController::checkout
* @see app/Http/Controllers/POSController.php:108
* @route '/pos/checkout'
*/
const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POSController::checkout
* @see app/Http/Controllers/POSController.php:108
* @route '/pos/checkout'
*/
checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

checkout.form = checkoutForm

const pos = {
    index: Object.assign(index, index),
    checkout: Object.assign(checkout, checkout),
}

export default pos