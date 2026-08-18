import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/penjualan/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/penjualan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
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
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/penjualan/buat/baru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
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
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/penjualan/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
export const print = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/penjualan/{order}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
print.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return print.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
print.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
print.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
const printForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
printForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
printForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
export const show = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/penjualan/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
show.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
show.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
show.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
const showForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
showForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
showForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
export const destroy = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/penjualan/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
destroy.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
destroy.delete = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
const destroyForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
destroyForm.delete = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const penjualan = {
    export: Object.assign(exportMethod, exportMethod),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    print: Object.assign(print, print),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
}

export default penjualan