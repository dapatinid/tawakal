import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
export const getOrderCodes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getOrderCodes.url(options),
    method: 'get',
})

getOrderCodes.definition = {
    methods: ["get","head"],
    url: '/api/sync/orders/codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
getOrderCodes.url = (options?: RouteQueryOptions) => {
    return getOrderCodes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
getOrderCodes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getOrderCodes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
getOrderCodes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getOrderCodes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
const getOrderCodesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getOrderCodes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
getOrderCodesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getOrderCodes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrderCodes
* @see app/Http/Controllers/Api/SyncApiController.php:76
* @route '/api/sync/orders/codes'
*/
getOrderCodesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getOrderCodes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getOrderCodes.form = getOrderCodesForm

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
export const getOrders = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getOrders.url(options),
    method: 'get',
})

getOrders.definition = {
    methods: ["get","head"],
    url: '/api/sync/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
getOrders.url = (options?: RouteQueryOptions) => {
    return getOrders.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
getOrders.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getOrders.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
getOrders.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getOrders.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
const getOrdersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getOrders.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
getOrdersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getOrders.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getOrders
* @see app/Http/Controllers/Api/SyncApiController.php:331
* @route '/api/sync/orders'
*/
getOrdersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getOrders.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getOrders.form = getOrdersForm

/**
* @see \App\Http\Controllers\Api\SyncApiController::uploadOrders
* @see app/Http/Controllers/Api/SyncApiController.php:95
* @route '/api/sync/orders'
*/
export const uploadOrders = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadOrders.url(options),
    method: 'post',
})

uploadOrders.definition = {
    methods: ["post"],
    url: '/api/sync/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SyncApiController::uploadOrders
* @see app/Http/Controllers/Api/SyncApiController.php:95
* @route '/api/sync/orders'
*/
uploadOrders.url = (options?: RouteQueryOptions) => {
    return uploadOrders.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SyncApiController::uploadOrders
* @see app/Http/Controllers/Api/SyncApiController.php:95
* @route '/api/sync/orders'
*/
uploadOrders.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadOrders.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::uploadOrders
* @see app/Http/Controllers/Api/SyncApiController.php:95
* @route '/api/sync/orders'
*/
const uploadOrdersForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadOrders.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::uploadOrders
* @see app/Http/Controllers/Api/SyncApiController.php:95
* @route '/api/sync/orders'
*/
uploadOrdersForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadOrders.url(options),
    method: 'post',
})

uploadOrders.form = uploadOrdersForm

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
export const getProducts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProducts.url(options),
    method: 'get',
})

getProducts.definition = {
    methods: ["get","head"],
    url: '/api/sync/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
getProducts.url = (options?: RouteQueryOptions) => {
    return getProducts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
getProducts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProducts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
getProducts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProducts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
const getProductsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProducts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
getProductsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProducts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getProducts
* @see app/Http/Controllers/Api/SyncApiController.php:45
* @route '/api/sync/products'
*/
getProductsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProducts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getProducts.form = getProductsForm

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
export const getCustomers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCustomers.url(options),
    method: 'get',
})

getCustomers.definition = {
    methods: ["get","head"],
    url: '/api/sync/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
getCustomers.url = (options?: RouteQueryOptions) => {
    return getCustomers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
getCustomers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCustomers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
getCustomers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCustomers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
const getCustomersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCustomers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
getCustomersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCustomers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SyncApiController::getCustomers
* @see app/Http/Controllers/Api/SyncApiController.php:18
* @route '/api/sync/customers'
*/
getCustomersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCustomers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getCustomers.form = getCustomersForm

const SyncApiController = { getOrderCodes, getOrders, uploadOrders, getProducts, getCustomers }

export default SyncApiController