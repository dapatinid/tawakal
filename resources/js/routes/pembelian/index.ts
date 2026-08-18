import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pembelian',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
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
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/pembelian/buat/baru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pembelian/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
export const print = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/pembelian/{purchaseOrder}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
print.url = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return print.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
print.get = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
print.head = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
const printForm = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
printForm.get = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
printForm.head = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

print.form = printForm

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
export const show = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pembelian/{purchaseOrder}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
show.url = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return show.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
show.get = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
show.head = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
const showForm = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
showForm.get = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
showForm.head = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
export const destroy = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/pembelian/{purchaseOrder}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
destroy.url = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return destroy.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
destroy.delete = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
const destroyForm = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
destroyForm.delete = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const pembelian = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    print: Object.assign(print, print),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
}

export default pembelian